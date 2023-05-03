import { Product } from "./product";

export class StockMovement {
    id: number;
    quantity: number;
    priorStock: number;
    date: Date;
    observations: string;
    product: Product;
}
