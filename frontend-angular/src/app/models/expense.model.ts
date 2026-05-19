import { TypePayment } from "./type-payment.model";
import { Topic } from "./topic.model";

export interface Expense {
    idExpense?: number,
    name: string,
    description: string,
    value: number,
    datePurchase: string,
    hourPurchase: string,
    paid: boolean,
    monthly: boolean,
    installment: boolean,
    numberInstallments?: number,
    valueInstallments?:number,
    topic: Topic,
    typePayment: TypePayment
}
