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
import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";

interface EditListingProps {
  trigger: React.ReactNode;
  property: Property;
  onUpdate: (updatedProperty: Property) => void; 
}

export default function EditListing({ trigger, property, onUpdate }: EditListingProps) {
  const api = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    title: property.title || "",
    description: property.description || "",
    location: property.location || "",
    area: property.area?.toString() || "",
    bedrooms: property.bedrooms?.toString() || "",
    bathrooms: property.bathrooms?.toString() || "",
    forRent: property.forRent || false,
    forSale: property.forSale || false,
    leaseTerm: property.leaseTerm || "",
    propertyType: property.propertyType || "",
    rentPrice: property.rentPrice?.toString() || "",
    salePrice: property.salePrice?.toString() || "",
    status: property.status || "available",
  });

  useEffect(() => {
    setFormData({
      title: property.title || "",
      description: property.description || "",
      location: property.location || "",
      area: property.area?.toString() || "",
      bedrooms: property.bedrooms?.toString() || "",
      bathrooms: property.bathrooms?.toString() || "",
      forRent: property.forRent || false,
      forSale: property.forSale || false,
      leaseTerm: property.leaseTerm || "",
      propertyType: property.propertyType || "",
      rentPrice: property.rentPrice?.toString() || "",
      salePrice: property.salePrice?.toString() || "",
      status: property.status || "available",
    });
  }, [property]);
  const [isLoading, setIsLoading] = useState(false); 
    const locationOptions = ["Addis Ababa", "Bole", "Kazanchis", "CMC", "Megenagna", "Piassa", "Mexico", "Bahir Dar", "Merkato"]
  const propertyTypes = ["apartment", "commercial", "house", "condo", "townhouse", "land"];
<div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
            <Select onValueChange={(v)=> handleChange("location", v as typeof formData.location)} value={formData.location}>
              <SelectTrigger className="w-full"><SelectValue/></SelectTrigger>
              <SelectContent>
                {locationOptions.map((t)=>(
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            </div>
  const handleChange = <T extends keyof typeof formData>(field: T, value: typeof formData[T]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const statusOptions = formData.forRent
    ? ["available", "rented", "pending"]
    : formData.forSale
    ? ["available", "sold", "pending"]
    : ["available", "pending"];

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const user = getAuth().currentUser;
  if (!user) {
    toast.error("You must be logged in.");
    return;
  }
  setIsLoading(true);

  const payload: Partial<Property> = {
    title: formData.title.trim(),
    description: formData.description.trim(),
    location: formData.location as typeof formData.location,
    area: Number(formData.area) || 0,
    bedrooms: Number(formData.bedrooms) || 0,
    bathrooms: Number(formData.bathrooms) || 0,
    propertyType: formData.propertyType as typeof formData.propertyType,
    forRent: formData.forRent,
    forSale: formData.forSale,
    status: formData.status as typeof formData.status,
  };

  if (formData.forSale && formData.salePrice) payload.salePrice = Number(formData.salePrice);
  if (formData.forRent && formData.rentPrice) payload.rentPrice = Number(formData.rentPrice);
  if (formData.forRent && formData.leaseTerm?.trim()) payload.leaseTerm = formData.leaseTerm.trim();

  try {
    const res = await fetch(`${api}/properties/${property.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const contentType = res.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      console.warn("Backend returned non-JSON:", text);
      if (!res.ok) throw new Error(text || "Update failed");
      data = property;
    }

    if (!res.ok) {
      throw new Error(data.message || data || "Failed to update property");
    }

    onUpdate("object" in data ? data : { ...property, ...payload }); 
    toast.success("Property updated!");
    document.getElementById("close-edit-dialog")?.click();
    setIsLoading(false)
  } catch (error: unknown) {
    let errorMessage = "Failed to add property";
   
   if (error instanceof Error) {
    errorMessage = error.message;
   } else if (typeof error === "string") {
    errorMessage = error;
   }

   toast.error(errorMessage);
  }
};

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogClose id="close-edit-dialog" className="hidden" />
      <DialogContent
        className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto"
        aria-describedby="edit-property-description"
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
            <p id="edit-property-description" className="text-sm text-muted-foreground">
              Update the details of your property listing.
            </p>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
                          <Label htmlFor="location">Location</Label>
                        <Select onValueChange={(v)=> handleChange("location", v as typeof formData.location)} value={formData.location}>
                          <SelectTrigger className="w-full"><SelectValue/></SelectTrigger>
                          <SelectContent>
                            {locationOptions.map((t)=>(
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        </div>

            <div className="grid gap-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e)=>handleChange("description", e.target.value)}/>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="area">Area (sq ft)</Label>
              <Input
                id="area"
                type="number"
                value={formData.area}
                onChange={(e) => handleChange("area", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Property Type</Label>
              <Select onValueChange={(v) => handleChange("propertyType", v as typeof formData.propertyType)} value={formData.propertyType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => handleChange("bedrooms", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) => handleChange("bathrooms", e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <Label className="block mb-2">Listing Type</Label>
              <div className="flex gap-8">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={formData.forRent}
                    onChange={() => setFormData((p) => ({ ...p, forRent: true, forSale: false }))}
                  />
                  For Rent
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={formData.forSale}
                    onChange={() => setFormData((p) => ({ ...p, forRent: false, forSale: true }))}
                  />
                  For Sale
                </label>
              </div>
            </div>

            {(formData.forRent || formData.forSale) && (
              <div className="grid gap-2 col-span-2 md:col-span-1">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => handleChange("status", v as typeof formData.status)}>
                  <SelectTrigger>
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
            )}

            {formData.forRent && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="leaseTerm">Lease Term</Label>
                  <Input
                    id="leaseTerm"
                    value={formData.leaseTerm}
                    onChange={(e) => handleChange("leaseTerm", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rentPrice">Rent Price</Label>
                  <Input
                    id="rentPrice"
                    type="number"
                    value={formData.rentPrice}
                    onChange={(e) => handleChange("rentPrice", e.target.value)}
                  />
                </div>
              </>
            )}

            {formData.forSale && (
              <div className="grid gap-2 col-span-2 md:col-span-1">
                <Label htmlFor="salePrice">Sale Price</Label>
                <Input
                  id="salePrice"
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => handleChange("salePrice", e.target.value)}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoading}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading} className="bg-[#1bada2] text-white hover:bg-[#15948b]">
             {isLoading? 'updating': 'Update Listing'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}