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
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";

interface AddListingProps {
  trigger: React.ReactNode;
  onAddListing: (property: Property) => void;
}

export function AddListing({ trigger, onAddListing }: AddListingProps) {
  const api = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    area: "" as string | number,
    bedrooms: "" as string | number,
    bathrooms: "" as string | number,
    forRent: false,
    forSale: false,
    leaseTerm: "",
    propertyType: "apartment" as const,
    rentPrice: "" as string | number,
    salePrice: "" as string | number,
    status: "available" as const,
  });

  const [isLoading, setIsLoading] = useState(false); 

  const propertyTypes = ["apartment", "commercial", "house", "condo", "townhouse", "land"];

  const handleChange = <T extends keyof typeof formData>(field: T, value: typeof formData[T]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
};

  const statusOptions = formData.forRent
    ? ["available", "rented", "pending"]
    : formData.forSale
    ? ["available", "sold", "pending"]
    : ["available"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = getAuth().currentUser;
    if (!user) {
      toast.error("You must be logged in");
      return;
    }
    if (!formData.forRent && !formData.forSale) {
      toast.error("Please select For Rent or For Sale");
      return;
    }

    setIsLoading(true); 

    const payload: Partial<Property> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      propertyType: formData.propertyType as Property["propertyType"],
      area: Number(formData.area) || 0,
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      forRent: formData.forRent,
      forSale: formData.forSale,
      status: formData.status as Property["status"],
      sellerId: user.uid,
    };

    if (formData.forSale && formData.salePrice) payload.salePrice = Number(formData.salePrice);
    if (formData.forRent && formData.rentPrice) payload.rentPrice = Number(formData.rentPrice);
    if (formData.forRent && formData.leaseTerm) payload.leaseTerm = formData.leaseTerm.trim();

    try {
      const res = await fetch(`${api}/add-property`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to add property");
      }

      const savedProperty: Property = await res.json();

      onAddListing(savedProperty);

      setFormData({
        title: "",
        description: "",
        location: "",
        area: "",
        bedrooms: "",
        bathrooms: "",
        forRent: false,
        forSale: false,
        leaseTerm: "",
        propertyType: "apartment",
        rentPrice: "",
        salePrice: "",
        status: "available",
      });

      
    }  catch (error: unknown) {
   let errorMessage = "Failed to add property";
   
   if (error instanceof Error) {
    errorMessage = error.message;
   } else if (typeof error === "string") {
    errorMessage = error;
   }

   toast.error(errorMessage);
  } finally {
      document.getElementById("close-add-dialog")?.click();
      setIsLoading(false); 
      location.reload();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogClose id="close-add-dialog" className="hidden" /> 
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Property</DialogTitle>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6 py-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={formData.title} onChange={(e) => handleChange("title", e.target.value)} required />
            </div>

            {/* Location */}
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={formData.location} onChange={(e) => handleChange("location", e.target.value)} required />
            </div>

            {/* Description */}
            <div className="grid gap-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={formData.description} onChange={(e) => handleChange("description", e.target.value)} />
            </div>

            {/* Area */}
            <div className="grid gap-2">
              <Label htmlFor="area">Area (sq ft)</Label>
              <Input id="area" type="number" value={formData.area} onChange={(e) => handleChange("area", e.target.value)} />
            </div>

            {/* Property Type */}
            <div className="grid gap-2">
              <Label>Property Type</Label>
              <Select onValueChange={(v) => handleChange("propertyType", v as typeof formData.propertyType)} value={formData.propertyType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid gap-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input id="bedrooms" type="number" value={formData.bedrooms} onChange={(e) => handleChange("bedrooms", e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input id="bathrooms" type="number" value={formData.bathrooms} onChange={(e) => handleChange("bathrooms", e.target.value)} />
            </div>

            {/* Listing Type */}
            <div className="col-span-2 space-y-4">
              <Label>Listing Type</Label>
              <div className="flex gap-8">
                <label className="flex items-center gap-2">
                  <input type="radio" checked={formData.forRent} onChange={() => setFormData(p => ({ ...p, forRent: true, forSale: false }))} />
                  For Rent
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" checked={formData.forSale} onChange={() => setFormData(p => ({ ...p, forRent: false, forSale: true }))} />
                  For Sale
                </label>
              </div>
            </div>

            {/* Status */}
            {(formData.forRent || formData.forSale) && (
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => handleChange("status", v as typeof formData.status)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(s => (
                      <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Conditional Fields */}
            {formData.forRent && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="leaseTerm">Lease Term</Label>
                  <Input id="leaseTerm" value={formData.leaseTerm} onChange={(e) => handleChange("leaseTerm", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rentPrice">Rent Price</Label>
                  <Input id="rentPrice" type="number" value={formData.rentPrice} onChange={(e) => handleChange("rentPrice", e.target.value)} />
                </div>
              </>
            )}

            {formData.forSale && (
              <div className="grid gap-2">
                <Label htmlFor="salePrice">Sale Price</Label>
                <Input id="salePrice" type="number" value={formData.salePrice} onChange={(e) => handleChange("salePrice", e.target.value)} />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#1bada2] hover:bg-teal-700 text-white"
              disabled={isLoading} // 👈 Disable while loading
            >
              {isLoading ? 'Saving...' : 'Save Listing'} {/* 👈 Loading text */}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}