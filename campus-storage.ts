import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

type CampusRecord = Record<string, any>;

const COLLECTION_TABLES = {
  complaints: 'complaints',
  requests: 'certificate_requests',
  gatePasses: 'gate_passes',
  notices: 'notices',
  notifications: 'notifications',
  attendance: 'attendance',
  attendanceEntries: 'attendance_entries',
  cancelledClasses: 'timetable',
  messFeedback: 'mess_feedback',
  auditLogs: 'audit_logs',
  hostels: 'hostels',
} as const;

const DATA_TABLES = [
  'complaints',
  'complaint_comments',
  'certificates',
  'certificate_requests',
  'gate_passes',
  'notices',
  'notifications',
  'attendance',
  'attendance_entries',
  'timetable',
  'mess_menu',
  'mess_feedback',
  'fees',
  'payments',
  'hostels',
  'rooms',
  'audit_logs',
] as const;

export class CampusStorage {
  private readonly database: DatabaseSync;

  constructor(databasePath: string) {
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    this.database = new DatabaseSync(databasePath);
    this.database.exec(`
      PRAGMA foreign_keys = ON;
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        email TEXT PRIMARY KEY,
        id TEXT NOT NULL,
        role TEXT NOT NULL,
        status TEXT NOT NULL,
        password_hash TEXT,
        data TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS sessions (
        token_hash TEXT PRIMARY KEY,
        user_email TEXT NOT NULL REFERENCES users(email) ON DELETE CASCADE,
        created_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
    `);

    for (const table of DATA_TABLES) {
      this.database.exec(`
        CREATE TABLE IF NOT EXISTS ${table} (
          id TEXT PRIMARY KEY,
          owner_email TEXT REFERENCES users(email) ON DELETE SET NULL,
          status TEXT,
          created_at TEXT,
          payload TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS ${table}_owner_idx ON ${table}(owner_email);
        CREATE INDEX IF NOT EXISTS ${table}_status_idx ON ${table}(status);
      `);
    }
  }

  load(initialData: CampusRecord, legacyPath: string): CampusRecord {
    const existingUserCount = this.database.prepare('SELECT COUNT(*) AS count FROM users').get() as { count: number };
    if (existingUserCount.count > 0) {
      return this.readDatabase(initialData);
    }

    let data = initialData;
    if (fs.existsSync(legacyPath)) {
      try {
        data = JSON.parse(fs.readFileSync(legacyPath, 'utf8')) as CampusRecord;
      } catch (error) {
        console.error('Unable to read legacy campus data; initializing from seed data:', error);
      }
    }

    this.migratePasswords(data);
    this.save(data);

    if (fs.existsSync(legacyPath)) {
      try {
        const sanitized = structuredClone(data);
        for (const user of Object.values(sanitized.users as Record<string, CampusRecord>)) {
          delete user.password;
          delete user.passwordHash;
        }
        fs.writeFileSync(legacyPath, JSON.stringify(sanitized, null, 2), 'utf8');
      } catch (error) {
        console.error('Unable to sanitize the legacy JSON data file after migration:', error);
      }
    }

    return data;
  }

  save(data: CampusRecord): void {
    this.database.exec('BEGIN IMMEDIATE');
    try {
      const insertUser = this.database.prepare(`
        INSERT INTO users (email, id, role, status, password_hash, data)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET
          id = excluded.id,
          role = excluded.role,
          status = excluded.status,
          password_hash = excluded.password_hash,
          data = excluded.data
      `);

      for (const [email, user] of Object.entries(data.users as Record<string, CampusRecord>)) {
        const safeData = { ...user };
        delete safeData.password;
        delete safeData.passwordHash;
        insertUser.run(
          email,
          String(user.id ?? email),
          String(user.role ?? 'Student'),
          String(user.status ?? 'active'),
          typeof user.passwordHash === 'string' ? user.passwordHash : null,
          JSON.stringify(safeData)
        );
      }

      const insertRecord = (table: string, id: string, payload: CampusRecord) => {
        const owner = payload.studentEmail ?? payload.userEmail ?? null;
        const ownerEmail = typeof owner === 'string' && data.users[owner] ? owner : null;
        const status = typeof payload.status === 'string' ? payload.status : null;
        const createdAt = typeof payload.createdAt === 'string' ? payload.createdAt : null;
        this.database.prepare(`
          INSERT INTO ${table} (id, owner_email, status, created_at, payload)
          VALUES (?, ?, ?, ?, ?)
        `).run(id, ownerEmail, status, createdAt, JSON.stringify(payload));
      };

      for (const table of DATA_TABLES) {
        this.database.prepare(`DELETE FROM ${table}`).run();
      }

      for (const [key, table] of Object.entries(COLLECTION_TABLES)) {
        const collection = data[key];
        if (!Array.isArray(collection)) continue;
        collection.forEach((item: CampusRecord | string, index: number) => {
          const payload = typeof item === 'string' ? { courseCode: item } : item;
          const id = String(payload.id ?? payload.courseCode ?? `${table}-${index + 1}`);
          insertRecord(table, id, payload);
        });
      }

      if (data.feeDetails) {
        insertRecord('fees', 'campus-fees', data.feeDetails);
        for (const payment of data.feeDetails.paymentHistory ?? []) {
          insertRecord('payments', String(payment.id ?? `payment-${Date.now()}`), payment);
        }
      }
      this.database.exec('COMMIT');
    } catch (error) {
      this.database.exec('ROLLBACK');
      throw error;
    }
  }

  createSession(userEmail: string, tokenHash: string, now: number, expiresAt: number): void {
    this.database.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(now);
    this.database.prepare(`
      INSERT INTO sessions (token_hash, user_email, created_at, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(tokenHash, userEmail, now, expiresAt);
  }

  findSession(tokenHash: string, now: number): { email: string; expiresAt: number } | undefined {
    this.database.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(now);
    const session = this.database.prepare(`
      SELECT user_email AS email, expires_at AS expiresAt
      FROM sessions WHERE token_hash = ? AND expires_at > ?
    `).get(tokenHash, now);
    return session as { email: string; expiresAt: number } | undefined;
  }

  deleteSession(tokenHash: string): void {
    this.database.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash);
  }

  deleteUserSessions(userEmail: string): void {
    this.database.prepare('DELETE FROM sessions WHERE user_email = ?').run(userEmail);
  }

  private readDatabase(initialData: CampusRecord): CampusRecord {
    const data: CampusRecord = structuredClone(initialData);
    const users: Record<string, CampusRecord> = {};
    for (const row of this.database.prepare('SELECT email, password_hash, data FROM users').all() as CampusRecord[]) {
      const user = JSON.parse(row.data);
      if (row.password_hash) user.passwordHash = row.password_hash;
      users[row.email] = user;
    }
    data.users = users;

    for (const [key, table] of Object.entries(COLLECTION_TABLES)) {
      const rows = this.database.prepare(`SELECT id, payload FROM ${table} ORDER BY rowid`).all() as CampusRecord[];
      data[key] = rows.map((row) => {
        const payload = JSON.parse(row.payload);
        if (key === 'cancelledClasses') return payload.courseCode;
        return payload;
      });
    }

    const fees = this.database.prepare("SELECT payload FROM fees WHERE id = 'campus-fees'").get() as CampusRecord | undefined;
    if (fees) data.feeDetails = JSON.parse(fees.payload);
    return data;
  }

  private migratePasswords(data: CampusRecord): void {
    for (const user of Object.values(data.users as Record<string, CampusRecord>)) {
      if (typeof user.password === 'string' && user.password.length > 0) {
        user.passwordHash = hashPassword(user.password);
      }
      delete user.password;
    }
  }
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: unknown): boolean {
  if (typeof storedHash !== 'string') return false;
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, 'hex');
  const actual = scryptSync(password, salt, expected.length);
  return expected.length > 0 && timingSafeEqual(actual, expected);
}

export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
