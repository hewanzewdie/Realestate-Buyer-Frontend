import {
  HeartIcon,
  BedIcon,
  BathIcon,
  MapPin,
  Ruler,
  MessageSquareText,
  PencilIcon,
  TrashIcon,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import EditListing from "@/pages/realtor/listing/EditListing";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProperty, getPropertyById } from "@/api/property";
import LoadingSkeleton from "../common/LoadingSkeleton";

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useQuery({
    queryFn: () => getPropertyById({ id: id! }),
    queryKey: ["property"],
  });

  const queryClient = useQueryClient();
  const property = data;
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorited = property ? favorites.includes(property.id) : false;

  const navigate = useNavigate();
  const user = getAuth().currentUser;
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setRole(snap.data().role);
      }
    };
    fetchRole();
  }, [user]);

  const handleUpdate = () => {
    window.location.reload();
    toast.success("Property updated!");
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      setDeleteDialogOpen(false);
      navigate("/realtorListings");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete property",
      );
    },
  });

  if (isLoading) {
    return <LoadingSkeleton type="propertyDetail" />;
  }

  if (isError) {
    return (
      <div className="bg-white p-10 text-center">
        <h1 className="text-2xl font-bold text-destructive">Error</h1>
        <p className="text-gray-600">Failed to load property</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="bg-white p-10 text-center">
        <h1 className="text-2xl font-bold text-destructive">Property not found</h1>
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
      <Button
        className="bg-primary"
        onClick={() => {
          navigate(-1);
        }}
      >
        <ArrowLeft />
      </Button>

      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-lg font-semibold">{property.title}</h1>
          <p className="text-sm text-gray-500 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {property.location}
          </p>
        </div>
        <div className="flex space-x-2">
          <div className="px-5 pb-5 flex justify-between items-center">
            {role === "seller" ? (
              <div className="flex gap-3">
                {/* Edit Modal */}
                <EditListing
                  trigger={
                    <Button
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 bg-white transition"
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
                    setDeleteDialogOpen(true);
                  }}
                  className="p-2 rounded-lg border border-red-300 hover:bg-red-50 bg-white transition"
                  title="Delete property"
                >
                  <TrashIcon className="w-5 h-5 text-destructive" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(property.id);
                }}
                disabled={!user}
                className="p-2 bg-white border border-red-200 hover:bg-red-100"
              >
                <HeartIcon
                  className={`w-5 h-5 transition-colors ${
                    isFavorited ? "fill-destructive text-destructive" : "text-gray-400"
                  }`}
                />
              </Button>
            )}
          </div>
          {user && role !== "seller" && property.sellerId !== user.uid && (
            <Button
              className="bg-white border border-gray-400 hover:bg-gray-100"
              onClick={() =>
                navigate(
                  `/messages?propertyId=${property.id}&sellerId=${property.sellerId}`,
                )
              }
              title="Message seller"
            >
              <MessageSquareText className="cursor-pointer text-gray-700" />
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 grid-rows-2 w-full h-86 mb-5 gap-2">
        <div className="col-start-1 col-end-3 row-start-1 row-end-3">
          <img
            src="https://images.unsplash.com/photo-1649083048428-3d8ed23a3ce0?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdXNlJTIwaW50ZXJpb3J8ZW58MHx8MHx8fDA%3D"
            alt=""
            className="h-full w-full"
          />
        </div>
        <div className=" col-start-3 col-end-5 row-start-1 row-end-2">
          <img
            src="https://images.unsplash.com/photo-1615873968403-89e068629265?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG91c2UlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D"
            alt=""
            className="w-full h-full"
          />
        </div>
        <div className="col-start-3 col-end-4 row-start-2 row-end-3">
          <img
            src="https://images.unsplash.com/photo-1649083048337-4aeb6dda80bb?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG91c2UlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D"
            alt=""
            className="h-full w-full"
          />
        </div>
        <div className="col-start-4 col-end-5 row-start-2 row-end-3">
          <img
            src="https://images.unsplash.com/photo-1616593918824-4fef16054381?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhvdXNlJTIwaW50ZXJpb3J8ZW58MHx8MHx8fDA%3D"
            alt=""
            className="h-full w-full"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex space-x-2 mb-2">
          <div className="border border-primary text-primary px-2 py-2 rounded-lg text-sm flex items-center">
            <BedIcon className="w-4 h-4 mr-1" /> {property.bedrooms || 0} Beds
          </div>
          <div className="border border-primary text-primary px-2 py-2 rounded-lg text-sm flex items-center">
            <BathIcon className="w-4 h-4 mr-1" /> {property.bathrooms || 0}{" "}
            Baths
          </div>
          <div className="border border-primary text-primary px-2 py-2 rounded-lg text-sm flex items-center">
            <Ruler className="w-4 h-4 mr-1" /> {property.area || 0} sqft
          </div>
        </div>
        <p className="border border-primary text-primary px-2 py-2 rounded-lg text-sm self-center">
          {property.forRent ? "For Rent" : "For Sale"}
        </p>
      </div>
      <div className="flex justify-between">
        <p className="text-sm text-gray-600 mb-2">
          {property.description || "No description available"}
        </p>
        <p className="text-xl font-bold text-primary ml-2">{priceText}</p>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Delete Property&nbsp;<i>{property.title}</i>
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-gray-600">This action can't be undone</p>
          </div>

          <DialogFooter className="gap-3 sm:gap-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="bg-destructive"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Property"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
