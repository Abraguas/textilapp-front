import { OrderDetailDTO } from "./order-detail-dto";
import { OrderState } from "./order-state";

export class GetOrderDTO {
    id: number;
    username: string;
    date: Date;
    state: OrderState;
    observations: string;
    details: OrderDetailDTO[];

}
