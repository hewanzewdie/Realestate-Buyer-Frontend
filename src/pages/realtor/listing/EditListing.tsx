import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import type { Property } from "@/types/property";
import React, { useEffect } from "react";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProperty, type CreatePropertyPayload } from "@/api/property";
import type { AxiosError } from "axios";

interface EditListingProps {
  trigger: React.ReactNode;
  property: Property;
  onUpdate?: (updatedProperty: Property) => void;
}

const editListingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(1, "Location is required"),
  area: z.coerce.number().positive("Area must be positive"),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  listingType: z.enum(["rent", "sale"]),
  propertyType: z.string().min(1, "Property type is required"),
  status: z.string().min(1, "Status is required"),
  rentPrice: z.coerce.number().optional(),
  salePrice: z.coerce.number().optional(),
  leaseTerm: z.string().optional(),
});

type EditListingFormInput = z.input<typeof editListingSchema>;
type EditListingFormOutput = z.output<typeof editListingSchema>;

export default function EditListing({
  trigger,
  property,
  onUpdate,
}: EditListingProps) {
  const queryClient = useQueryClient();
  const user = getAuth().currentUser;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditListingFormInput, unknown, EditListingFormOutput>({
    resolver: zodResolver(editListingSchema),
    defaultValues: {
      title: property.title,
      description: property.description,
      location: property.location,
      area: property.area,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      propertyType: property.propertyType,
      listingType: property.forSale ? "sale" : "rent",
      status: property.status,
      rentPrice: property.rentPrice,
      salePrice: property.salePrice,
      leaseTerm: property.leaseTerm,
    },
  });

  useEffect(() => {
    reset({
      ...property,
      listingType: property.forSale ? "sale" : "rent",
    });
  }, [property, reset]);

  const watchListingType = watch("listingType");

  const editPropertyMutation = useMutation({
    mutationFn: (payload: CreatePropertyPayload) =>
      editProperty(property.id, payload),
    onSuccess: (updatedData) => {
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      onUpdate?.(updatedData);
      document.getElementById("close-edit-dialog")?.click();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error?.response?.data?.message || "Failed to update property",
      );
    },
  });

  const onSubmit = (data: EditListingFormOutput) => {
    if (!user) return;

    const payload = {
      ...data,
      sellerId: user.uid,
      forRent: data.listingType === "rent",
      forSale: data.listingType === "sale",
      rentPrice: data.listingType === "rent" ? data.rentPrice : undefined,
      salePrice: data.listingType === "sale" ? data.salePrice : undefined,
      leaseTerm: data.listingType === "rent" ? data.leaseTerm : undefined,
    };

    editPropertyMutation.mutate(payload);
  };

  const propertyTypes = [
    "apartment",
    "commercial",
    "house",
    "condo",
    "townhouse",
    "land",
  ];
  const locationOptions = [
    "Addis Ababa",
    "Bole",
    "Kazanchis",
    "CMC",
    "Megenagna",
    "Piassa",
    "Mexico",
    "Bahir Dar",
    "Merkato",
  ];

  const statusOptions =
    watchListingType === "rent"
      ? ["available", "rented", "pending"]
      : ["available", "sold", "pending"];

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogClose id="close-edit-dialog" className="hidden" />
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input id="edit-title" {...register("title")} />
              {errors.title && (
                <p className="text-xs text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Location</Label>
              <Select
                value={watch("location")}
                onValueChange={(val) =>
                  setValue("location", val, { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea id="edit-desc" {...register("description")} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-area">Area (sq ft)</Label>
              <Input id="edit-area" type="number" {...register("area")} />
            </div>

            <div className="grid gap-2">
              <Label>Property Type</Label>
              <Select
                value={watch("propertyType")}
                onValueChange={(val) =>
                  setValue("propertyType", val, { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-bed">Bedrooms</Label>
              <Input id="edit-bed" type="number" {...register("bedrooms")} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-bath">Bathrooms</Label>
              <Input id="edit-bath" type="number" {...register("bathrooms")} />
            </div>

            <div className="col-span-2 space-y-4">
              <Label>Listing Type</Label>
              <div className="flex gap-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Input
                    type="radio"
                    value="rent"
                    {...register("listingType")}
                    className="w-4 h-4 accent-teal-600"
                  />
                  For Rent
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Input
                    type="radio"
                    value="sale"
                    {...register("listingType")}
                    className="w-4 h-4 accent-teal-600"
                  />
                  For Sale
                </label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(val) =>
                  setValue("status", val, { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {watchListingType === "rent" ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="edit-lease">Lease Term</Label>
                  <Input id="edit-lease" {...register("leaseTerm")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-rent">Rent Price</Label>
                  <Input
                    id="edit-rent"
                    type="number"
                    {...register("rentPrice")}
                  />
                </div>
              </>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="edit-sale">Sale Price</Label>
                <Input
                  id="edit-sale"
                  type="number"
                  {...register("salePrice")}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-primary text-white hover:bg-teal-700"
              disabled={editPropertyMutation.isPending}
            >
              {editPropertyMutation.isPending
                ? "Updating..."
                : "Update Listing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
