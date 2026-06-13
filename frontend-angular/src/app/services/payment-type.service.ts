import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaymentType } from '../models/payment-type.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentTypeService {
  //Injeção de dependência
  private http = inject(HttpClient);

  //URL da api do backend
  private apiUrl = 'http://localhost:8080/type-payments';

  public paymentTypeSelected = signal<PaymentType | null>(null);

  public typePaymentsList = signal<PaymentType[]>([]);

  public loadPaymentTypes(): Observable<PaymentType[]> {
    return this.http.get<PaymentType[]>(this.apiUrl);
  }

 public addPaymentType(paymentType: PaymentType): Observable<PaymentType> {
     return this.http.post<PaymentType>(this.apiUrl, paymentType).pipe(
       tap({
         next: (paymentTypeInserted: PaymentType) => {
           this.typePaymentsList.update(paymentList => [...paymentList, paymentTypeInserted]);
         },
         error: (error) => {
           console.error("Erro ao inserir o tipo de pagamento: ", error);
         },
       })
     );
   }
 
   public deletePaymentType(id: number): Observable<void> {
     return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe();
   }

   public updatePaymentType(id: number, paymentType: PaymentType): Observable<PaymentType> {
     return this.http.put<PaymentType>(`${this.apiUrl}/${id}`, paymentType).pipe(
       tap({
         next: (paymentTypeUpdate: PaymentType) => {
           this.typePaymentsList.update(typePaymentsList => 
             typePaymentsList.map(t => t.idTypePayments === id ? paymentTypeUpdate : t)
           );
         },
         error: (error) => {
           console.error("Erro ao atualizar o tipo de pagamento: ", error);
         },
       })
     );
   }
}
