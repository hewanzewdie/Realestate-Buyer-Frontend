import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../firebase";
import toast from "react-hot-toast";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid);
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          const data = userDoc.data();
          setFavorites(data?.favorites || []);
        } catch (err) {
          console.error("Failed to load favorites:", err);
        }
      } else {
        setUserId(null);
        setFavorites([]);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (userId) {
      console.debug("Active user ID (for reference):", userId);
    }
  }, [userId]);

  const toggleFavorite = async (propertyId: string) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("Please login to save favorites");
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
      toast.error("Could not update favorites. Try again.");
    }
  };

  return { favorites, loading, toggleFavorite };
}
