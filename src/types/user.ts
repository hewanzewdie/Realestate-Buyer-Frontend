export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  password: string; 
  role: 'buyer' | 'seller'; 
  favorites: string[]; 
  propertiesListed: string[];
  createdAt: Date;
}