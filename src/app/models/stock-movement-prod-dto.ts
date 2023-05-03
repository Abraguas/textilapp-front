export class StockMovementProdDTO {
    id: number;
    quantity: number;
    priorStock: number;
    date: Date;
    observations: string;
    product: string;
    unit: string;
}
