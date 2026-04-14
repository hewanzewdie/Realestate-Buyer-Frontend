import { getAuth } from "firebase/auth";
import PropertyCard from "../../../components/listings/PropertyCard";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { AddListing } from "./AddListing";
import { getAllProperties } from "@/api/property";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Property } from "@/types/property";
import LoadingSkeleton from "@/components/common/LoadingSkeleton";

export default function SellerListings() {
  const user = getAuth().currentUser;
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-properties"],
    queryFn: getAllProperties,
  });

  if (!user) {
    return <p className="text-center py-10">User not logged in</p>;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-10">
        {[...Array(3)].map((_, i) => (
          <LoadingSkeleton type="propertyCard" key={i} />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-center py-10 text-destructive">
        Failed to fetch properties
      </p>
    );
  }

  const allProperties: Property[] = data;

  const properties = allProperties.filter(
    (property) => property.sellerId === user.uid,
  );

  const handleAddListing = () => {
    queryClient.invalidateQueries({ queryKey: ["my-properties"] });
  };

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center py-10">
        <p className="text-gray-500 mb-6">
          You haven’t added any properties yet.
        </p>

        <AddListing
          trigger={
            <Button className="bg-primary">
              <PlusIcon />
              Add Property
            </Button>
          }
          onAddListing={handleAddListing}
        />
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold mb-6">My Listings</h2>

        <AddListing
          trigger={
            <Button className="bg-primary">
              <PlusIcon />
              Add Property
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
