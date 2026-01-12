export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    brand: string;
    country: string;
    category: string;
    image?: string;

    // NEW: для фильтров (пока без бекенда)
    color?: string;
    quantity?: number;
}