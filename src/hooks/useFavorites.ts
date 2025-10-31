// src/hooks/useFavorites.ts
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../firebase"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  // Load favorites when user changes
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const loadFavorites = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const data = userDoc.data();
        setFavorites(data?.favorites || []);
      } catch (err) {
        console.error("Failed to load favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  const toggleFavorite = async (propertyId: string) => {
    if (!user) {
      alert("Please log in to save favorites");
      return;
    }

    const isFavorited = favorites.includes(propertyId);
    const userRef = doc(db, "users", user.uid);

    try {
      if (isFavorited) {
        await updateDoc(userRef, {
          favorites: arrayRemove(propertyId),
        });
        setFavorites((prev) => prev.filter((id) => id !== propertyId));
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(propertyId),
        });
        setFavorites((prev) => [...prev, propertyId]);
      }
    } catch (err) {
      console.error("Failed to update favorite:", err);
      alert("Could not update favorites. Try again.");
    }
  };

  return { favorites, loading, toggleFavorite };
}