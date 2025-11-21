import {
  HeartIcon,
  BedIcon,
  BathIcon,
  MapPin,
  Ruler,
  MessageSquareText,
  MessageCircleQuestionMark,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Property } from "../../types/property";
import { useFavorites } from "@/hooks/useFavorites";
import { getAuth } from "firebase/auth";

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { favorites, toggleFavorite } = useFavorites();
  const isFavorited = property ? favorites.includes(property.id) : false;

  const api = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching property ${id} from API...`);

        const response = await fetch(`${api}/properties/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Property not found");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Property API Response:", data);
        console.log("Property data structure:", {
          id: data.id,
          title: data.title,
          description: data.description,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          area: data.area,
          location: data.location,
          forSale: data.forSale,
          forRent: data.forRent,
          salePrice: data.salePrice,
          rentPrice: data.rentPrice,
        });
        setProperty(data);
      } catch (error) {
        console.error("Error fetching property:", error);
        setError(
          `Failed to fetch property details: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, api]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading property details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-10 text-center">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="bg-white p-10 text-center">
        <h1 className="text-2xl font-bold text-red-500">Property not found</h1>
        <p className="text-gray-600">
          The property you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  const priceText = property.forSale
    ? `$${property.salePrice || 0}`
    : `$${property.rentPrice || 0}/month`;

  return (
    <div className="bg-white p-10">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-lg font-semibold">{property.title}</h1>
          <p className="text-sm text-gray-500 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {property.location}
          </p>
        </div>
        <div className="flex space-x-2">

            <HeartIcon onClick={() => property && toggleFavorite(property.id)}
              className={`w-6 h-6 transition-colors ${
                isFavorited ? "fill-red-500 text-red-500" : ""
              }`}
            />
                 <MessageSquareText className="cursor-pointer" />
          <MessageCircleQuestionMark className="cursor-pointer" />
        </div>
      </div>
      <div className="grid grid-cols-4 grid-rows-2 w-full h-86 mb-5 gap-2">
        <div className="bg-green-400 col-start-1 col-end-3 row-start-1 row-end-3"></div>
        <div className="bg-yellow-400 col-start-3 col-end-5 row-start-1 row-end-2"></div>
        <div className="bg-red-400 col-start-3 col-end-4 row-start-2 row-end-3"></div>
        <div className="bg-blue-400 col-start-4 col-end-5 row-start-2 row-end-3"></div>
      </div>

      <div className="flex justify-between">
        <div className="flex space-x-2 mb-2">
          <div className="border border-[#1bada2] text-[#1bada2] px-2 py-2 rounded-lg text-sm flex items-center">
            <BedIcon className="w-4 h-4 mr-1" /> {property.bedrooms || 0} Beds
          </div>
          <div className="border border-[#1bada2] text-[#1bada2] px-2 py-2 rounded-lg text-sm flex items-center">
            <BathIcon className="w-4 h-4 mr-1" /> {property.bathrooms || 0}{" "}
            Baths
          </div>
          <div className="border border-[#1bada2] text-[#1bada2] px-2 py-2 rounded-lg text-sm flex items-center">
            <Ruler className="w-4 h-4 mr-1" /> {property.area || 0} sqft
          </div>
        </div>
        <p className="border border-[#1bada2] text-[#1bada2] px-2 py-2 rounded-lg text-sm self-center">
          {property.forRent ? "For Rent" : "For Sale"}
        </p>
      </div>
      <div className="flex justify-between">
        <p className="text-sm text-gray-600 mb-2">
          {property.description || "No description available"}
        </p>
        <p className="text-xl font-bold text-red-500 ml-2">{priceText}</p>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Location</h2>
        <div className="bg-pink-300 h-86 rounded-lg">
          <p className="p-4 text-center text-gray-700">
            Map would be displayed here
          </p>
        </div>
      </div>
    </div>
  );
}
