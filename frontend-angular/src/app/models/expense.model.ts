import { PaymentType } from "./payment-type.model";
import { Topic } from "./topic.model";

export interface Expense {
    idExpense?: number,
    name: string,
    description: string,
    value: number,
    datePurchase: string | null,
    hourPurchase: string | null,
    paid: boolean,
    monthly: boolean,
    installment: boolean,
    numberInstallments: number,
    valueInstallments:number,
    topic: Topic,
    paymentType: PaymentType
}
