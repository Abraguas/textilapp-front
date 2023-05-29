import { PaymentMethod } from "./payment-method";

export class PaymentDTO {
    id: number;
    username: string;
    date: Date;
    observations: string;
    ammountCharged: number;
    transactionNumber: string;
    orderId: number;
    paymentMethod: PaymentMethod;
}
