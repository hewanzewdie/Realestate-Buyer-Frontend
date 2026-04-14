import { BedIcon, BathIcon, Ruler, MapPin } from "lucide-react";
import type { Property } from "@/types/property";

interface DisplayProps {
  property: Property;
  actions: React.ReactNode;
  onCardClick: () => void;
}

export function PropertyCardDisplay({
  property,
  actions,
  onCardClick,
}: DisplayProps) {
  return (
    <div
      className="flex flex-col gap-3 w-full bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
      onClick={onCardClick}
    >
      <div className="relative">
        <p
          className={`absolute text-sm w-20 text-center p-1 text-white rounded-full top-2 left-2 z-10 ${property.forSale ? "bg-green-600" : "bg-blue-600"}`}
        >
          {property.forRent ? "For Rent" : "For Sale"}
        </p>
        <img
          src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500"
          alt={property.title}
          className="rounded-t-2xl w-full h-48 object-cover"
        />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold truncate">{property.title}</h3>
        <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
          <MapPin className="w-4 h-4" />{" "}
          <span className="truncate">{property.location}</span>
        </div>
        <div className="flex items-center space-x-3 text-gray-600 text-sm">
          <div className="flex items-center gap-1">
            <BedIcon className="w-4 h-4" /> {property.bedrooms}
          </div>
          <span>|</span>
          <div className="flex items-center gap-1">
            <BathIcon className="w-4 h-4" /> {property.bathrooms}
          </div>
          <span>|</span>
          <div className="flex items-center gap-1">
            <Ruler className="w-4 h-4" /> {property.area} m²
          </div>
        </div>
        <hr className="my-3" />
        <p className="text-xl font-bold text-primary">
          $
          {(property.forSale
            ? property.salePrice
            : property.rentPrice
          )?.toLocaleString()}
          {property.forRent && "/mo"}
        </p>
      </div>
      <div className="px-5 pb-5 flex justify-end">{actions}</div>
    </div>
  );
}
