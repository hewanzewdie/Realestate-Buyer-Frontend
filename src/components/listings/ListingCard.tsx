// PropertyCard.tsx
import { HeartIcon, BedIcon, BathIcon, Ruler, MapPin, PencilIcon, TrashIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "../../hooks/useFavorites";
import type { Property } from "../../types/property";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import EditListing from "@/pages/realtor/listing/EditListing";
import { Button } from "../ui/button";
function PropertyCard(property: Property) {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorited = favorites.includes(property.id);

  const user = getAuth().currentUser;
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setRole(snap.data().role); // "buyer" or "seller"
      }
    };
    fetchRole();
  }, [user]);

  const handleUpdate = () => {
  window.location.reload();
  toast.success("Property updated!");
};

  const handleDelete = async () => {
  if (!confirm("Delete this property?")) return;

  try {
    const api = import.meta.env.VITE_API_URL;

    const res = await fetch(`${api}/properties/${property.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Failed with status ${res.status}`);
    }

    toast.success("Property deleted");

    window.location.reload();
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete property");
  }
};

  return (
    <div className="block">
      <div className="flex flex-col gap-3 md:w-100 w-80 bg-[#f0ffff] rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
        <Link to={`/listingDetail/${property.id}`} className="block">
          <div className="relative">
            <p
              className={`absolute text-sm w-20 text-center p-1 text-white rounded-full top-2 left-2 z-10 ${
                property.forSale ? "bg-green-600" : "bg-blue-600"
              }`}
            >
              {property.forRent ? "For Rent" : "For Sale"}
            </p>
            <img
              src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&auto=format&fit=crop&q=60"
              alt={property.title}
              className="rounded-t-2xl w-full h-48 object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-semibold">{property.title}</h3>
              <p className="text-xl font-bold text-orange-600">
                ${property.forSale ? property.salePrice?.toLocaleString() : property.rentPrice?.toLocaleString()}
                {property.forRent && "/mo"}
              </p>
            </div>

            <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
              <MapPin className="w-4 h-4" />
              <span>{property.location}</span>
            </div>

            <div className="flex items-center space-x-3 text-gray-600 text-sm">
              <div className="flex items-center gap-1">
                <BedIcon className="w-4 h-4" /> {property.bedrooms} Beds
              </div>
              <span>|</span>
              <div className="flex items-center gap-1">
                <BathIcon className="w-4 h-4" /> {property.bathrooms} Baths
              </div>
              <span>|</span>
              <div className="flex items-center gap-1">
                <Ruler className="w-4 h-4" /> {property.area} m²
              </div>
            </div>
          </div>
        </Link>

        {/* Action Buttons — Outside the Link */}
        <div className="px-5 pb-5 flex justify-between items-center">
          {role === "seller" ? (
            <div className="flex gap-3">
              {/* Edit Dialog */}
              <EditListing
                trigger={
                  <Button
                    onClick={(e) => e.stopPropagation()} // ← THIS IS KEY
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 bg-green-50 transition"
                    title="Edit property"
                  >
                    <PencilIcon className="w-5 h-5 text-gray-700" />
                  </Button>
                }
                property={property}
                onUpdate={handleUpdate}
              />

              {/* Delete Button */}
              <Button
  onClick={(e) => {
    e.stopPropagation();
    handleDelete();
  }}
  className="p-2 rounded-lg border border-red-300 hover:bg-red-50 bg-green-50 transition"
  title="Delete property"
>
  <TrashIcon className="w-5 h-5 text-red-600" />
</Button>

            </div>
          ) : (
            // Favorite for buyers
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(property.id);
              }}
              className="p-2 bg-green-50 hover:bg-red-100"
            >
              <HeartIcon
                className={`w-5 h-5 transition-colors ${
                  isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"
                }`}
              />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;