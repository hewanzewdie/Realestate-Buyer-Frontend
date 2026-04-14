import { useFavorites } from "../../../hooks/useFavorites";
import PropertyCard from "../../../components/listings/PropertyCard";
import { getPropertyById } from "@/api/property";
import { useQueries } from "@tanstack/react-query";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";
import type { Property } from "@/types/property";

export default function FavoritesPage() {
  const { favorites, loading: favoritesListLoading } = useFavorites();

  const results = useQueries({
    queries: favorites.map((id) => ({
      queryKey: ["property", id],
      queryFn: () => getPropertyById({ id }),
    })),
  });

  const isLoadingProperties = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);

  const favoriteProperties: Property[] = results
    .map((result) => result.data)
    .filter((prop): prop is Property => !!prop);

  if (favoritesListLoading || isLoadingProperties) {
    return (
      <div className="p-5">
        <h2 className="text-2xl font-semibold mb-6">
          Your Favorite Properties
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <LoadingSkeleton key={i} type="propertyCard" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center py-10 text-destructive">
        Error loading favorites.
      </p>
    );
  }

  if (favorites.length === 0 || favoriteProperties.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl font-semibold text-gray-600">No favorites yet</p>
        <p className="text-gray-500 mt-2">
          Save properties you like to view them here later.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold mb-6">Your Favorite Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteProperties.map((property) => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </div>
    </div>
  );
}
