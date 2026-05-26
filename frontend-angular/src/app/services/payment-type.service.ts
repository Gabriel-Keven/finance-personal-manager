import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaymentType } from '../models/payment-type.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentTypeService {
  //Injeção de dependência
  private http = inject(HttpClient);

  //URL da api do backend
  private apiUrl = 'http://localhost:8080/type-payments';

  public typePaymentsList = signal<PaymentType[]>([]);

  public loadPaymentTypes(): void {
    this.http.get<PaymentType[]>(this.apiUrl).subscribe({
      next: (paymentTypes) =>{
        this.typePaymentsList.set(paymentTypes);
      },
      error:(error) =>{
        console.log("Erro: ",error);
      }
    });
  }

  public addPaymentType(paymentType: PaymentType):void {
    this.http.post<PaymentType>(this.apiUrl,paymentType).subscribe({
      next:(paymentTypeInserted: PaymentType) => {
        this.typePaymentsList.update(typePaymentsList => [...typePaymentsList, paymentTypeInserted]);
      },
      error:(error)=> {
        console.log("Erro: ", error);
      }
    })
  }
}
