// src/lib/createUserProfile.ts
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import type { User as FirebaseUser } from "firebase/auth";
import type { User } from "../types/user"; // <-- your custom type

/**
 * Creates or updates the Firestore user document to match your `User` interface.
 * Only runs if the document doesn't exist or is missing required fields.
 */
export const createUserProfile = async (
  firebaseUser: FirebaseUser,
  extraData?: Partial<User>
) => {
  const userRef = doc(db, "users", firebaseUser.uid);

  const userData: User = {
    id: firebaseUser.uid,
    email: firebaseUser.email || "",
    name: extraData?.name || firebaseUser.displayName || "",
    phone: extraData?.phone || "",
    password: "", // Never store plain password!
    role: extraData?.role || "buyer",
    favorites: extraData?.favorites || [],
    propertiesListed: extraData?.propertiesListed || [],
    createdAt: new Date(), // Will be overridden by serverTimestamp on write
  };

  await setDoc(
    userRef,
    {
      ...userData,
      createdAt: serverTimestamp(), // Firestore timestamp
      updatedAt: serverTimestamp(),
    },
    { merge: true } // Safe update
  );
};