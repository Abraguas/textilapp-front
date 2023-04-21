import { Brand } from "./brand";
import { Color } from "./color";
import { Unit } from "./unit";

export class Product {
    id: number;
    name: string;
    description: string;
    brand: Brand;
    pricePerUnit: number;
    unit: Unit;
    observations: string;
    stock: number;
    measurment: string;
    color: Color;
    subCategory: any;
    image: string;
    isListed: boolean;
}
