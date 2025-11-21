import Listing, { type ListingFilters } from "../../public/listing/Listing";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useState } from "react";
import { useFavorites } from "../../../hooks/useFavorites";

export default function Listings() {
  const [type, setType] = useState<ListingFilters["type"]>("all");
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [propertyType, setPropertyType] = useState<
    ListingFilters["propertyType"]
  >(undefined);
  const [activeTab, setActiveTab] = useState<"all" | "saved">("all");

  const { favorites, loading: favoritesLoading } = useFavorites();

  const filters: ListingFilters = {
    type,
    minPrice,
    maxPrice,
    location,
    propertyType,
  };

  const clearFilters = () => {
    setType("all");
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setLocation(undefined);
    setPropertyType(undefined);
  };

  return (
    <div className="p-10 flex flex-col space-y-5">
      <p className="text-2xl font-semibold">Listings</p>

      {/* Sale/Rent buttons */}
      <div className="flex space-x-3">
        <Button
          className={`p-1.5 w-16 rounded-md ${
            type === "all"
              ? "bg-[#1bada2] hover:bg-[#1bada2]"
              : "bg-gray-300 text-black hover:text-white"
          }`}
          onClick={() => setType("all")}
        >
          All
        </Button>
        <Button
          className={`p-1.5 w-16 rounded-md ${
            type === "sale"
              ? "bg-[#1bada2] hover:bg-[#1bada2]"
              : "bg-gray-300 text-black hover:text-white"
          }`}
          onClick={() => setType("sale")}
        >
          Sale
        </Button>
        <Button
          className={`p-1.5 w-16 rounded-md ${
            type === "rent"
              ? "bg-[#1bada2] hover:bg-[#1bada2]"
              : "bg-gray-300 text-black hover:text-white"
          }`}
          onClick={() => setType("rent")}
        >
          Rent
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div className="flex flex-col md:flex-row md:space-x-5 gap-5">
          {/* Min Price */}
          <div className="flex flex-col space-y-2">
            <p>Min price</p>
            <Select onValueChange={(v) => setMinPrice(Number(v))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="10000">10,000</SelectItem>
                <SelectItem value="20000">20,000</SelectItem>
                <SelectItem value="50000">50,000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Max Price */}
          <div className="flex flex-col space-y-2">
            <p>Max price</p>
            <Select onValueChange={(v) => setMaxPrice(Number(v))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="30000">30,000</SelectItem>
                <SelectItem value="100000">100,000</SelectItem>
                <SelectItem value="500000">500,000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="flex flex-col space-y-2">
            <p>Location</p>
            <Select onValueChange={(v) => setLocation(v)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Addis Ababa">Addis Ababa</SelectItem>
                <SelectItem value="Bole">Bole</SelectItem>
                <SelectItem value="Kazanchis">Kazanchis</SelectItem>
                <SelectItem value="CMC">CMC</SelectItem>
                <SelectItem value="Megenagna">Megenagna</SelectItem>
                <SelectItem value="Piazza">Piazza</SelectItem>
                <SelectItem value="Gelan">Gelan</SelectItem>
                <SelectItem value="Bahir Dar">Bahir Dar</SelectItem>
                <SelectItem value="Merkato">Merkato</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Property Type */}
          <div className="flex flex-col space-y-2">
            <p>Property type</p>
            <Select onValueChange={(v) => setPropertyType(v as any)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          <Button
            onClick={clearFilters}
            className="bg-[#1bada2] p-1 w-full self-end md:w-40 rounded-lg text-white"
          >
            Clear filters
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-5">
        <button
          onClick={() => setActiveTab("all")}
          className={`font-semibold ${
            activeTab === "all"
              ? "text-green-600 underline underline-green-600"
              : "text-gray-600"
          }`}
        >
          All Listings
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`font-semibold ${
            activeTab === "saved"
              ? "text-green-600 underline underline-green-600"
              : "text-gray-600"
          }`}
        >
          Saved Listings
        </button>
      </div>

      {/* Listings */}
      <div>
        {favoritesLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : activeTab === "saved" ? (
          favorites.length > 0 ? (
            <Listing filters={{ ...filters, favorites }} />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Nothing to show here</p>
              <p className="text-gray-400">
                You haven't saved any properties yet.
              </p>
            </div>
          )
        ) : (
          <Listing filters={filters} />
        )}
      </div>
    </div>
  );
}
