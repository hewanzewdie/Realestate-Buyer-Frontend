import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
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
import React from "react";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProperty } from "@/api/property";

interface AddListingProps {
  trigger: React.ReactNode;
  onAddListing?: (property: Property) => void;
}

const addListingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(1, "Location is required"),
  area: z.coerce.number().positive("Area must be positive"),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  listingType: z.enum(["rent", "sale"]),
  propertyType: z.string().min(1, "Property type is required"),
  status: z.string().default("available"),
  rentPrice: z.coerce.number().optional(),
  salePrice: z.coerce.number().optional(),
  leaseTerm: z.string().optional(),
});

type AddListingFormData = z.infer<typeof addListingSchema>;

export function AddListing({ trigger, onAddListing }: AddListingProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddListingFormData>({
    resolver: zodResolver(addListingSchema),
    defaultValues: {
      status: "available",
      listingType: "rent",
    },
  });

  const addPropertyMutation = useMutation({
    mutationFn: createProperty,
    onSuccess: (newProperty) => {
      toast.success("Property added successfully!");
      reset();
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      onAddListing?.(newProperty);
      document.getElementById("close-add-dialog")?.click();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add property");
    },
  });

  const onSubmit: SubmitHandler<AddListingFormData> = (data) => {
    const user = getAuth().currentUser;
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    const payload = {
      title: data.title,
      description: data.description,
      location: data.location,
      propertyType: data.propertyType,
      area: data.area,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      status: data.status,
      sellerId: user.uid,
      forRent: data.listingType === "rent",
      forSale: data.listingType === "sale",
      rentPrice: data.listingType === "rent" ? data.rentPrice : undefined,
      salePrice: data.listingType === "sale" ? data.salePrice : undefined,
      leaseTerm: data.listingType === "rent" ? data.leaseTerm : undefined,
    };

    addPropertyMutation.mutate(payload);
  };

  const watchListingType = watch("listingType");
  const propertyTypes = [
    "apartment",
    "commercial",
    "house",
    "condo",
    "townhouse",
    "land",
  ];
  const locationOptions = [
    "Bole",
    "Kazanchis",
    "CMC",
    "Megenagna",
    "Piassa",
    "Mexico",
    "Merkato",
    "4 Kilo",
    "Kaliti",
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogClose id="close-add-dialog" className="hidden" />
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Property</DialogTitle>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Select
                onValueChange={(val) =>
                  setValue("location", val, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location && (
                <p className="text-xs text-destructive">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} />
              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="area">Area (sq ft)</Label>
              <Input
                id="area"
                type="number"
                placeholder="0"
                {...register("area")}
              />
              {errors.area && (
                <p className="text-xs text-destructive">{errors.area.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Property Type</Label>
              <Select
                onValueChange={(val) =>
                  setValue("propertyType", val, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.propertyType && (
                <p className="text-xs text-destructive">
                  {errors.propertyType.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                placeholder="0"
                {...register("bedrooms")}
              />
              {errors.bedrooms && (
                <p className="text-xs text-destructive">
                  {errors.bedrooms.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                placeholder="0"
                {...register("bathrooms")}
              />
              {errors.bathrooms && (
                <p className="text-xs text-destructive">
                  {errors.bathrooms.message}
                </p>
              )}
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

            {watchListingType === "rent" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="leaseTerm">Lease Term</Label>
                  <Input
                    id="leaseTerm"
                    {...register("leaseTerm")}
                    placeholder="e.g. 1 year"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rentPrice">Monthly Rent</Label>
                  <Input
                    id="rentPrice"
                    type="number"
                    {...register("rentPrice")}
                  />
                </div>
              </>
            )}

            {watchListingType === "sale" && (
              <div className="grid gap-2">
                <Label htmlFor="salePrice">Sale Price</Label>
                <Input
                  id="salePrice"
                  type="number"
                  {...register("salePrice")}
                />
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-primary hover:bg-teal-700 text-white"
              disabled={addPropertyMutation.isPending}
            >
              {addPropertyMutation.isPending ? "Saving..." : "Save Listing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}