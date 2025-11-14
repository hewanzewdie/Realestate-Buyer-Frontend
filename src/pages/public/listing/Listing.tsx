import PropertyCard from "../../../components/listings/ListingCard";
import type { Property } from "../../../types/property";
import { useEffect, useState } from "react";

// const allProperties: Property[] = [
//   { id: "1", title: "Modern Apartment in City Center", description: "A beautiful apartment located in the heart of the city.", propertyType: 'apartment', forRent: true, forSale: false, rentPrice: 25000, location: "Addis Ababa", bedrooms: 2, bathrooms: 1, area: 85, status: 'available', createdAt: new Date() },
//   { id: "2", title: "Spacious Family House", description: "Large house with backyard.", propertyType: 'house', forSale: true, forRent: false, salePrice: 150000, location: "Bole", bedrooms: 4, bathrooms: 3, area: 200, status: 'sold', createdAt: new Date() },
//   { id: "3", title: "Luxury Condo with Pool", description: "High-end condo with pool and gym.", propertyType: 'condo', forRent: true, forSale: false, rentPrice: 30000, location: "Kazanchis", bedrooms: 3, bathrooms: 2, area: 150, status: 'pending', createdAt: new Date() },
//   { id: "4", title: "Townhouse Near Park", description: "Cozy townhouse near green area.", propertyType: 'townhouse', forSale: true, forRent: false, salePrice: 95000, location: "CMC", bedrooms: 3, bathrooms: 2, area: 140, status: 'available', createdAt: new Date() },
//   { id: "5", title: "Affordable Apartment", description: "Great starter apartment.", propertyType: 'apartment', forRent: false, forSale: true, salePrice: 70000, location: "Megenagna", bedrooms: 2, bathrooms: 1, area: 75, status: 'available', createdAt: new Date() },
//   { id: "6", title: "Office Space Downtown", description: "Commercial office space.", propertyType: 'commercial', forRent: true, forSale: false, rentPrice: 60000, location: "Piasa", bedrooms: 0, bathrooms: 2, area: 300, status: 'available', createdAt: new Date() },
//   { id: "7", title: "Suburban Family Home", description: "Quiet neighborhood house.", propertyType: 'house', forSale: true, forRent: false, salePrice: 120000, location: "Gelan", bedrooms: 3, bathrooms: 2, area: 180, status: 'available', createdAt: new Date() },
//   { id: "8", title: "City Studio", description: "Compact studio for singles.", propertyType: 'apartment', forRent: true, forSale: false, rentPrice: 15000, location: "Addis Ababa", bedrooms: 1, bathrooms: 1, area: 45, status: 'available', createdAt: new Date() },
//   { id: "9", title: "Lakeview Villa", description: "Premium villa with lake view.", propertyType: 'house', forSale: true, forRent: false, salePrice: 450000, location: "Bahir Dar", bedrooms: 5, bathrooms: 4, area: 400, status: 'available', createdAt: new Date() },
//   { id: "10", title: "Market-side Condo", description: "Condo near market.", propertyType: 'condo', forRent: true, forSale: false, rentPrice: 22000, location: "Merkato", bedrooms: 2, bathrooms: 1, area: 90, status: 'available', createdAt: new Date() },
// ];

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

  const api = import.meta.env.VITE_API_URL;

  const filtered = applyFilters(allProperties, props.filters ?? {});
  const displayProperties = props.showOnly
    ? filtered.slice(0, props.showOnly)
    : filtered;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching properties from API...");

        const response = await fetch(`${api}/properties`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);
        setAllProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError(
          `Failed to fetch properties: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (displayProperties.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">No properties found</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
      {displayProperties.map((property) => (
        <PropertyCard key={property.id} {...property} />
      ))}
    </div>
  );
}
export default PropertyList;
