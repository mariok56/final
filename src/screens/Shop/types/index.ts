export interface Product {
    id: number;
    name: string;
    brand: string;
    price: number;
    salePrice?: number;
    image: string;
    category: string;
    bestseller: boolean;
    isNew: boolean;
    inStock: boolean;
  }
  
  export interface CartItem {
    product: Product;
    quantity: number;
  }