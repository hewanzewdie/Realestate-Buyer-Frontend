import { api } from "@/lib/axios";
import type { Property } from "@/types/property";

export const getAllProperties = async () => {
  const res = await api.get<Property[]>(`/properties`);
  return res.data;
};

interface GetPropertyByIdParams {
  id: string;
}

export const getPropertyById = async ({ id }: GetPropertyByIdParams) => {
  const res = await api.get<Property>(`properties/${id}`, {});
  return res.data;
};

export interface CreatePropertyPayload {
  title: string;
  description: string;
  location: string;
  propertyType: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  forSale: boolean;
  forRent: boolean;
  status: string;
  sellerId: string;
  salePrice?: number;
  rentPrice?: number;
  leaseTerm?: string;
}

export const createProperty = async (
  payload: CreatePropertyPayload,
): Promise<Property> => {
  const res = await api.post("/add-property", payload);
  return res.data;
};

export const editProperty = async (
  id: string,
  payload: CreatePropertyPayload,
): Promise<Property> => {
  const res = await api.put(`/properties/${id}`, payload);
  return res.data;
};

export const deleteProperty = async (id: string) => {
  const res = await api.delete<Property>(`properties/${id}`, {});
  return res.data;
};
