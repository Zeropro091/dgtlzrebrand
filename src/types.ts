export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  imageUrl: string;
  span?: string; // e.g., 'col-span-4' or 'col-span-6'
}
