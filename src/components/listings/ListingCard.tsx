// PropertyCard.tsx
import { HeartIcon, BedIcon, BathIcon, Ruler, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "../../hooks/useFavorites";
import type { Property } from "../../types/property";

function PropertyCard(property: Property) {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorited = favorites.includes(property.id);

  const getStatusColor = (forSale: boolean) => {
    return forSale ? "bg-green-600" : "bg-blue-600";
  };

  return (
    <Link to={`/listingDetail/${property.id}`} className="block">
      <div className="flex flex-col gap-3 md:w-100 w-80 bg-[#f0ffff] rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
        <div className="relative">
          <p
            className={`absolute text-sm w-16 text-center p-1 text-white rounded-full top-2 left-2 z-10 ${getStatusColor(
              property.forSale
            )}`}
          >
            {property.forRent ? "For Rent" : "For Sale"}
          </p>
          <img
            src="https://images.unsplash.com/photo-1759238136818-7b00ec9e782a?w=500&auto=format&fit=crop&q=60"
            alt={property.title}
            className="rounded-xl w-full h-48 object-cover"
          />
        </div>

        <div className="flex flex-col flex-grow justify-end p-5">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold">{property.title}</h3>
            <p className="text-xl font-bold text-orange-600">
              ${property.forSale ? property.salePrice : property.rentPrice}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <MapPin className="w-4 h-4" /> <span>{property.location}</span>
            </div>

            
              <HeartIcon
              onClick={(e) => {
                e.preventDefault(); 
                toggleFavorite(property.id);
              }}
                className={`w-5 h-5 transition-colors ${
                  isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"
                }`}
              />
          </div>

          <div className="flex items-center space-x-3 text-gray-600 mt-2 text-sm">
            <div className="flex items-center gap-1">
              <BedIcon className="w-4 h-4" /> {property.bedrooms} Beds
            </div>
            <p>|</p>
            <div className="flex items-center gap-1">
              <BathIcon className="w-4 h-4" /> {property.bathrooms} Baths
            </div>
            <p>|</p>
            <div className="flex items-center gap-1">
              <Ruler className="w-4 h-4" /> {property.area} m²
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PropertyCard;