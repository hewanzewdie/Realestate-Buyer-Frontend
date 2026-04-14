import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
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
  const queryClient = useQueryClient();
  const auth = getAuth();
  const user = auth.currentUser;

  const { data: favorites = [], isLoading } = useQuery<string[]>({
    queryKey: ["favorites", user?.uid],
    queryFn: async () => {
      if (!user) return [];
      const userDoc = await getDoc(doc(db, "users", user.uid));
      return (userDoc.data()?.favorites as string[] | undefined) || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  const toggleMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      if (!user) throw new Error("Authentication required");

      const isFavorited = favorites.includes(propertyId);
      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, {
        favorites: isFavorited
          ? arrayRemove(propertyId)
          : arrayUnion(propertyId),
      });

      return { propertyId, isFavorited };
    },
    onMutate: async (propertyId) => {
      await queryClient.cancelQueries({ queryKey: ["favorites", user?.uid] });
      const previousFavorites = queryClient.getQueryData<string[]>([
        "favorites",
        user?.uid,
      ]);

      queryClient.setQueryData(
        ["favorites", user?.uid],
        (old: string[] = []) => {
          return old.includes(propertyId)
            ? old.filter((id) => id !== propertyId)
            : [...old, propertyId];
        },
      );

      return { previousFavorites };
    },
    onError: (_err, _propertyId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(
          ["favorites", user?.uid],
          context.previousFavorites,
        );
      }
      toast.error("Failed to update favorites");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", user?.uid] });
    },
  });

  const toggleFavorite = (propertyId: string) => {
    if (!user) {
      toast.error("Please login to save favorites");
      return;
    }
    toggleMutation.mutate(propertyId);
  };

  return {
    favorites,
    loading: isLoading,
    toggleFavorite,
    isToggling: toggleMutation.isPending,
  };
}
