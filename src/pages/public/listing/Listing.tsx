import PropertyCard from "../../../components/listings/PropertyCard";
import type { Property } from "../../../types/property";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getAllProperties } from "@/api/property";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";

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
  filters: ListingFilters,
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
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);

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

    return unsubscribe;
  }, [auth, db]);

  const { data, isLoading, isError } = useQuery({
    queryFn: getAllProperties,
    queryKey: ["all-properties"],
  });

  const properties = data ?? [];

  let displayProperties = applyFilters(properties, props.filters ?? {});

  if (role === "seller") {
    displayProperties = displayProperties.filter(
      (property) => property.sellerId === user?.uid,
    );
  }
  if (props.showOnly !== undefined) {
    displayProperties = displayProperties.slice(0, props.showOnly);
  }
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <LoadingSkeleton type="propertyCard" key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-destructive py-10">
        Error: Failed to load properties
      </div>
    );
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
