import { useEffect, useState } from "react";
import { useFavorites } from "../../../hooks/useFavorites";
import PropertyCard from "../../../components/listings/ListingCard";
import type { Property } from "../../../types/property";

export default function FavoritesPage() {
  const { favorites, loading } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const api = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (loading) return;
    if (favorites.length === 0) {
      setProperties([]);
      return;
    }

    const fetchFavorites = async () => {
      setIsFetching(true);
      try {
        const fetchedProperties = await Promise.all(
          favorites.map(async (id) => {
            const res = await fetch(`${api}/properties/${id}`);
            if (!res.ok) throw new Error(`Failed to fetch property ${id}`);
            return res.json();
          })
        );
        setProperties(fetchedProperties);
      } catch (err) {
        console.error("Failed to load favorite properties:", err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchFavorites();
  }, [favorites, loading, api]);

  if (loading || isFetching)
    return <p className="text-center text-gray-500 py-10">Loading favorites...</p>;

  if (favorites.length === 0 || properties.length === 0)
    return (
      <div className="text-center py-20">
        <p className="text-2xl font-semibold text-gray-600">No favorites yet</p>
        <p className="text-gray-500 mt-2">
          Save properties you like to view them here later.
        </p>
      </div>
    );

  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold mb-6">Your Favorite Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </div>
    </div>
  );
}
