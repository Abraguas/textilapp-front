import { PaymentMethod } from "./payment-method"

export class RegisterPaymentDTO {
    observations: String
    orderId: number
    paymentMethod: PaymentMethod
    transactionNumber: String
}
