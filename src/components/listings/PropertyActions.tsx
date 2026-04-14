import { PencilIcon, TrashIcon, HeartIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProperty } from "@/api/property";
import EditListing from "@/pages/realtor/listing/EditListing";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Property } from "@/types/property";

interface ActionsProps {
  property: Property;
  role: string | null;
  isFavorited: boolean;
  onFavoriteToggle: () => void;
}

export function PropertyActions({
  property,
  role,
  isFavorited,
  onFavoriteToggle,
}: ActionsProps) {
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteProperty(property.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-properties"] });
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      setDeleteDialogOpen(false);
      toast.success("Deleted successfully");
    },
  });

  if (role === "seller") {
    return (
      <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
        <EditListing
          trigger={
            <Button variant="outline" className="p-2 h-9 w-9 bg-green-50">
              <PencilIcon className="w-4 h-4 text-gray-700" />
            </Button>
          }
          property={property}
          onUpdate={() =>
            queryClient.invalidateQueries({ queryKey: ["all-properties"] })
          }
        />

        <Button
          variant="outline"
          className="p-2 h-9 w-9 bg-red-50 border-red-200"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <TrashIcon className="w-4 h-4 text-destructive" />
        </Button>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Property</DialogTitle>
            </DialogHeader>
            <p>
              Delete <strong>{property.title}</strong>? This cannot be undone.
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate()}
              >
                {deleteMutation.isPending ? "Deleting..." : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      className="p-2 h-9 w-9 bg-green-50"
      onClick={(e) => {
        e.stopPropagation();
        onFavoriteToggle();
      }}
    >
      <HeartIcon
        className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-destructive" : "text-gray-400"}`}
      />
    </Button>
  );
}
