import { db } from '../lib/firebase.js';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';

const getUserDocRef = (uid) => doc(db, 'users', uid);

export const ensureUserProfile = async ({ uid, email, displayName, photoURL }) => {
  const ref = getUserDocRef(uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return;
  await setDoc(ref, {
    email: email || null,
    displayName: displayName || null,
    photoURL: photoURL || null,
    createdAt: serverTimestamp(),
    folders: []
  });
};

export const getUserFolders = async (uid) => {
  const ref = getUserDocRef(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return [];
  const data = snap.data();
  return Array.isArray(data.folders) ? data.folders : [];
};

export const setUserFolders = async (uid, folders) => {
  const ref = getUserDocRef(uid);
  await updateDoc(ref, { folders });
};

export const logUserEvent = async (uid, event) => {
  const ref = getUserDocRef(uid);
  await updateDoc(ref, {
    activity: arrayUnion({
      ...event,
      ts: new Date().toISOString()
    })
  });
};

