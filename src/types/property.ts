export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType?: 'apartment' | 'house' | 'condo' | 'townhouse' | 'land' | 'commercial';
  bedrooms: number;
  bathrooms:number;
  area: number;
  location: string;
  createdAt: Date;
  forSale: boolean;
  forRent: boolean;
  salePrice?: number;
  rentPrice?: number;
  leaseTerm?: string;
  status: 'available' | 'sold' | 'rented' | 'pending'; 
  sellerId: string;
}