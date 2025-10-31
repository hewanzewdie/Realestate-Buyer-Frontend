// import type { Property } from "@/types/property";
// import ListingCard from "../../../components/listings/ListingCard";

// export default function Favorites() {
//   const favorites: Property[] = [
//     //     {
//     //         id: "1",
//     //         title: "Cozy Apartment in Downtown",
//     //         description: "A beautiful and cozy apartment located in the heart of the city.",
//     //         bedrooms: 2,
//     //         bathrooms: 1,
//     //         area: 850,
//     //         location: "123 Main St, Downtown",
//     //         createdAt: new Date(),
//     //         forSale: false,
//     //         forRent: true,
//     //         rentPrice: 1500,
//     //         status: "available",
//     //     },
//     //     {
//     //         id: "2",
//     //         title: "Spacious Family Home",
//     //         description: "A spacious home perfect for families, with a large backyard.",
//     //         bedrooms: 4,
//     //         bathrooms: 3,
//     //         area: 2500,
//     //         location: "456 Oak Ave, Suburbia",
//     //         createdAt: new Date(),
//     //         forSale: true,
//     //         forRent: false,
//     //         salePrice: 350000,
//     //         status: "available",
//     //     },
//     // {
//     //         id: "3",
//     //         title: "Modern Condo with City View",
//     //         description: "A modern condo offering stunning views of the city skyline.",
//     //         bedrooms: 3,
//     //         bathrooms: 2,
//     //         area: 1200,
//     //         location: "789 Pine St, Uptown",
//     //         createdAt: new Date(),
//     //         forSale: true,
//     //         forRent: false,
//     //         salePrice: 450000,
//     //         status: "available",
//     // }
//   ];

//   return (
//     <div className="p-10">
//       <p className="text-2xl font-semibold">Favorites</p>
//       <div className="mt-6">
//         {favorites.length === 0 ? (
//           <div className="text-center py-8">
//             <p className="text-gray-500 text-lg">Nothing to show here</p>
//             <p className="text-gray-400">
//               You haven't saved any properties yet.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {favorites.map((property) => (
//               <ListingCard key={property.id} {...property} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// FavoritesPage.tsx
import { useFavorites } from "../../../hooks/useFavorites";
import { useEffect, useState } from "react";
import PropertyCard from "../../../components/listings/ListingCard";
import type { Property } from "../../../types/property";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (favorites.length === 0) {
      setProperties([]);
      return;
    }

    const fetchFavorites = async () => {
      const res = await fetch(`/api/properties?favorites=${favorites.join(",")}`);
      const data = await res.json();
      setProperties(data);
    };

    fetchFavorites();
  }, [favorites]);

  if (properties.length === 0) return <p>No favorites yet.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5">
      {properties.map((p) => (
        <PropertyCard key={p.id} {...p} />
      ))}
    </div>
  );
}