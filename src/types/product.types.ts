export interface Product {
    category: string;
    description: string;
    id: number;
    price: number;
    rating: Rating;
    title: string;
    image: string;
}

export interface Rating{
    count: number;
    rate: number;
}