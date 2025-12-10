import PropertyCard from "../../../components/listings/ListingCard";
import type { Property } from "../../../types/property";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export type ListingFilters = {
  type?: "all" | "sale" | "rent";
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  propertyType?: Property["propertyType"];
  favorites?: string[];
};

function applyFilters(
  properties: Property[],
  filters: ListingFilters
): Property[] {
  const {
    type = "all",
    minPrice,
    maxPrice,
    location,
    propertyType,
    favorites,
  } = filters;

  return properties.filter((p) => {
    if (type === "sale" && !p.forSale) return false;
    if (type === "rent" && !p.forRent) return false;

    const price = p.forSale ? p.salePrice : p.rentPrice;
    if (minPrice != null && (price ?? 0) < minPrice) return false;
    if (maxPrice != null && (price ?? 0) > maxPrice) return false;

    if (location && !p.location.toLowerCase().includes(location.toLowerCase()))
      return false;
    if (propertyType && p.propertyType !== propertyType) return false;
    if (favorites && favorites.length > 0 && !favorites.includes(p.id))
      return false;

    return true;
  });
}

function PropertyList(props: { filters?: ListingFilters; showOnly?: number }) {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const api = import.meta.env.VITE_API_URL;
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const snap = await getDoc(doc(db, "users", currentUser.uid));
          if (snap.exists()) {
            setRole(snap.data()?.role);
          } else {
            setRole(null);
          }
        } catch (err) {
          console.error("Failed to fetch role:", err);
          setRole(null);
        }
      } else {
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${api}/properties`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data: Property[] = await response.json();

        if (user && role?.toLowerCase() === "seller") {
          const sellerOnly = data.filter((p) => p.sellerId === user.uid);
          setAllProperties(sellerOnly);
        } else {
          setAllProperties(data);
        }
      } catch (err) {
        setError("Failed to load properties");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [api, user, role]); 

  const filtered = applyFilters(allProperties, props.filters ?? {});
  const displayProperties = props.showOnly
    ? filtered.slice(0, props.showOnly)
    : filtered;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 py-10">Error: {error}</div>;
  }

  if (displayProperties.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        {user && role?.toLowerCase() === "seller"
          ? "You haven't listed any properties yet."
          : "No properties found matching your criteria."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayProperties.map((property) => (
        <PropertyCard key={property.id} {...property} />
      ))}
    </div>
  );
}

export default PropertyList;