/**
 * Campus 360 - Firebase Client SDK Integration
 * Connected to Firebase Project: apna-campus-db438
 * Provides Firebase Authentication & Cloud Firestore database with real-time sync.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  Auth,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  Firestore,
  Unsubscribe,
  DocumentData,
} from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCvt45pR4mSnf1mQGqT19HfMPmWbf7aMx4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "apna-campus-db438.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "apna-campus-db438",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "apna-campus-db438.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "923058129111",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:923058129111:web:c0bf1b28a9265d4dd24892",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-NVTCPH49S6"
};

// Singleton App, Auth, and Firestore instances
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// Safe Analytics initialization (runs only in browser environments supporting it)
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics optional in offline or restrictive environments
  });
}

/**
 * Authentication Helpers
 */
export async function firebaseSignIn(email: string, password: string): Promise<FirebaseUser> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

export async function firebaseSignUp(email: string, password: string): Promise<FirebaseUser> {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

export async function firebaseSignOut(): Promise<void> {
  await signOut(auth);
}

export async function firebaseResetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

export function subscribeToAuthState(callback: (user: FirebaseUser | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

/**
 * Firestore Real-Time & CRUD Helpers
 */

/**
 * Real-time subscription to a Firestore collection
 */
export function subscribeToFirestoreCollection<T = any>(
  collectionName: string,
  onData: (items: T[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  try {
    const collRef = collection(db, collectionName);
    const q = query(collRef);
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as unknown as T[];
        onData(items);
      },
      (error) => {
        console.warn(`[Firestore] Subscription error on ${collectionName}:`, error.message);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.warn(`[Firestore] Could not attach listener to ${collectionName}:`, err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Get all items from a collection
 */
export async function getFirestoreCollection<T = any>(collectionName: string): Promise<T[]> {
  try {
    const collRef = collection(db, collectionName);
    const snapshot = await getDocs(collRef);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as unknown as T[];
  } catch (err) {
    console.warn(`[Firestore] Failed to get docs from ${collectionName}:`, err);
    return [];
  }
}

/**
 * Get single document by ID
 */
export async function getFirestoreDocument<T = any>(collectionName: string, docId: string): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, docId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as unknown as T;
    }
    return null;
  } catch (err) {
    console.warn(`[Firestore] Error reading ${collectionName}/${docId}:`, err);
    return null;
  }
}

/**
 * Set document (upsert)
 */
export async function setFirestoreDocument(
  collectionName: string,
  docId: string,
  data: DocumentData,
  merge: boolean = true
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge });
  } catch (err) {
    console.warn(`[Firestore] Error writing to ${collectionName}/${docId}:`, err);
  }
}

/**
 * Add document with auto-generated ID
 */
export async function addFirestoreDocument(collectionName: string, data: DocumentData): Promise<string | null> {
  try {
    const collRef = collection(db, collectionName);
    const docRef = await addDoc(collRef, {
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    console.warn(`[Firestore] Error adding doc to ${collectionName}:`, err);
    return null;
  }
}

/**
 * Update document fields
 */
export async function updateFirestoreDocument(
  collectionName: string,
  docId: string,
  data: DocumentData
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn(`[Firestore] Error updating doc ${collectionName}/${docId}:`, err);
  }
}

/**
 * Delete document
 */
export async function deleteFirestoreDocument(collectionName: string, docId: string): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn(`[Firestore] Error deleting doc ${collectionName}/${docId}:`, err);
  }
}
