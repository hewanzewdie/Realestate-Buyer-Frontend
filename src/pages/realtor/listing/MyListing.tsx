import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import type { Property } from "../../../types/property";
import PropertyCard from "../../../components/listings/ListingCard";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { AddListing } from "./AddListing";

export default function SellerListings() {
const [properties, setProperties] = useState<Property[]>([]);
const [loading, setLoading] = useState(true);

const api = import.meta.env.VITE_API_URL;
const user = getAuth().currentUser;

const handleAddListing = (newProperty: Property) => {
setProperties((prev) => [...prev, newProperty]);
};

useEffect(() => {
if (!user) return;

const fetchListings = async () => {
setLoading(true);
try {
const res = await fetch(`${api}/properties`);
const data: Property[] = await res.json();

const sellerProps = data.filter(
(property) => property.sellerId === user.uid
);

setProperties(sellerProps);
} catch (err) {
console.error("Failed to load seller listings:", err);
} finally {
setLoading(false);
}
};

fetchListings();
}, [user, api]); 

if (loading) return <p className="text-center py-10 text-gray-500">Loading...</p>;

if (properties.length === 0)
return (
<>
<p className="text-center py-10 text-gray-500">
You haven’t added any properties yet.
</p>

<AddListing
trigger={
<Button className="bg-[#1bada2]">
<PlusIcon/>Add Property
</Button>
}
onAddListing={handleAddListing}
/>
</>
);

return (
<div className="p-5">
<div className="flex justify-between">
<h2 className="text-2xl font-semibold mb-6">My Listings</h2>

<AddListing
trigger={
<Button className="bg-[#1bada2]">
<PlusIcon/>Add Property
</Button>
}
onAddListing={handleAddListing}
/>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{properties.map((property) => (
<PropertyCard key={property.id} {...property} />
))}
</div>
</div>
);
}