import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let adminApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;
let isInitialized = false;

export function getFirebaseAdmin() {
  if (isInitialized && adminApp && adminDb && adminAuth) {
    return { app: adminApp, auth: adminAuth, db: adminDb, available: true };
  }

  try {
    if (getApps().length > 0) {
      adminApp = getApps()[0];
    } else {
      const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH 
        ? path.resolve(__dirname, process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
        : path.resolve(__dirname, 'firebase-service-account.json');

      if (!fs.existsSync(saPath)) {
        console.warn(`[Firebase Admin] Service account file not found at ${saPath}`);
        return { app: null, auth: null, db: null, available: false };
      }

      const serviceAccount = JSON.parse(fs.readFileSync(saPath, 'utf8'));
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || 'apna-campus-db438',
      });
    }

    adminAuth = getAuth(adminApp);
    adminDb = getFirestore(adminApp);
    // Ignore undefined properties so Firestore writes don't reject objects with optional undefined fields
    adminDb.settings({ ignoreUndefinedProperties: true });

    isInitialized = true;
    console.log('[Firebase Admin] Successfully initialized Firebase Admin for project:', adminApp.options.projectId);
    return { app: adminApp, auth: adminAuth, db: adminDb, available: true };
  } catch (err) {
    console.error('[Firebase Admin] Failed to initialize Firebase Admin:', err);
    return { app: null, auth: null, db: null, available: false };
  }
}

/**
 * Seed initial users and campus collections into Firestore & Firebase Auth if empty
 */
export async function seedFirebaseCollections(initialDb: any) {
  const { auth, db, available } = getFirebaseAdmin();
  if (!available || !db || !auth) {
    console.warn('[Firebase Seed] Skipped: Firebase Admin not available');
    return { success: false, reason: 'Firebase Admin not available' };
  }

  try {
    console.log('[Firebase Seed] Checking Firestore collections...');

    // 1. Seed Users to Firebase Auth & Firestore
    const usersMap = initialDb.users || {};
    for (const [emailKey, userData] of Object.entries(usersMap) as [string, any][]) {
      const email = userData.email || emailKey;
      if (!email || !email.includes('@')) continue;

      // Check if user exists in Firebase Auth
      let authUser = null;
      try {
        authUser = await auth.getUserByEmail(email);
      } catch (err: any) {
        if (err.code === 'auth/user-not-found') {
          try {
            const password = userData.password || 'password123';
            // Use auto-generated or email-specific UID to avoid conflict across aliases
            authUser = await auth.createUser({
              email: email,
              emailVerified: true,
              password: password.length >= 6 ? password : `${password}123`,
              displayName: userData.name || 'Campus 360 User',
              disabled: userData.status === 'disabled',
            });
            console.log(`[Firebase Auth] Created user in Firebase Auth: ${email} (UID: ${authUser.uid})`);
          } catch (createErr) {
            console.warn(`[Firebase Auth] Could not create user ${email}:`, createErr);
          }
        }
      }

      // Upsert user profile into Firestore `users` collection
      const userDocRef = db.collection('users').doc(email);
      const safeUserData = { ...userData };
      delete safeUserData.password; // Do not store plaintext password in Firestore
      safeUserData.updatedAt = new Date().toISOString();
      await userDocRef.set(safeUserData, { merge: true });
    }

    // 2. Helper to batch seed a collection if empty
    async function seedCollectionIfEmpty(collectionName: string, items: any[], idField = 'id') {
      if (!items || items.length === 0) return;
      const collRef = db!.collection(collectionName);
      const existing = await collRef.limit(1).get();
      if (!existing.empty) {
        return; // Already populated
      }

      console.log(`[Firebase Seed] Seeding collection: ${collectionName} (${items.length} items)...`);
      const batch = db!.batch();
      for (const item of items) {
        const docId = String(item[idField] || `${collectionName}_${Date.now()}_${Math.random().toString(36).substring(7)}`);
        const docRef = collRef.doc(docId);
        batch.set(docRef, {
          ...item,
          syncedAt: new Date().toISOString()
        });
      }
      await batch.commit();
      console.log(`[Firebase Seed] Collection ${collectionName} seeded successfully.`);
    }

    // Seed data collections
    await seedCollectionIfEmpty('complaints', initialDb.complaints || []);
    await seedCollectionIfEmpty('requests', initialDb.requests || []);
    await seedCollectionIfEmpty('gate_passes', initialDb.gatePasses || []);
    await seedCollectionIfEmpty('notices', initialDb.notices || []);
    await seedCollectionIfEmpty('notifications', initialDb.notifications || []);
    await seedCollectionIfEmpty('attendance', initialDb.attendance || [], 'courseCode');
    await seedCollectionIfEmpty('mess_feedback', initialDb.messFeedback || []);
    await seedCollectionIfEmpty('hostels', initialDb.hostels || [], 'name');
    await seedCollectionIfEmpty('audit_logs', initialDb.auditLogs || []);

    // Fee Details as single doc
    if (initialDb.feeDetails) {
      const feeDoc = db.collection('settings').doc('fee_details');
      const snap = await feeDoc.get();
      if (!snap.exists) {
        await feeDoc.set(initialDb.feeDetails);
        console.log('[Firebase Seed] Seeded fee_details in settings collection');
      }
    }

    console.log('[Firebase Seed] Completed Firebase seeding successfully.');
    return { success: true };
  } catch (err) {
    console.error('[Firebase Seed] Error during seeding:', err);
    return { success: false, error: err };
  }
}

/**
 * Sync document mutation to Firestore
 */
export async function syncToFirestore(collectionName: string, docId: string, data: any, merge = true) {
  const { db, available } = getFirebaseAdmin();
  if (!available || !db) return;

  try {
    const docRef = db.collection(collectionName).doc(docId);
    await docRef.set({
      ...data,
      lastModified: new Date().toISOString()
    }, { merge });
  } catch (err) {
    console.error(`[Firestore Sync] Error saving to ${collectionName}/${docId}:`, err);
  }
}

/**
 * Delete document from Firestore
 */
export async function deleteFromFirestore(collectionName: string, docId: string) {
  const { db, available } = getFirebaseAdmin();
  if (!available || !db) return;

  try {
    await db.collection(collectionName).doc(docId).delete();
  } catch (err) {
    console.error(`[Firestore Sync] Error deleting ${collectionName}/${docId}:`, err);
  }
}

/**
 * Fetch all documents from a Firestore collection
 */
export async function fetchFirestoreCollection<T = any>(collectionName: string): Promise<T[]> {
  const { db, available } = getFirebaseAdmin();
  if (!available || !db) return [];

  try {
    const snap = await db.collection(collectionName).get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  } catch (err) {
    console.error(`[Firestore Fetch] Error fetching ${collectionName}:`, err);
    return [];
  }
}
