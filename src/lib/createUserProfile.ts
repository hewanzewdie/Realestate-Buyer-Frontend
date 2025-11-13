import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import type { User } from "firebase/auth"; 

const db = getFirestore();

export async function createUserProfile(user: User | null, extraData: Record<string, unknown> = {}) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      ...extraData,
    });
  }
}
