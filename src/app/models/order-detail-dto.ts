import { Product } from "./product";

export class OrderDetailDTO {
    quantity: number;
    pricePerUnit: number;
    product: Product;
}
