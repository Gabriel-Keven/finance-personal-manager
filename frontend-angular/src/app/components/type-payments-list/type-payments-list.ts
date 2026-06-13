import { Component, inject, OnInit, signal } from '@angular/core';
import { PaymentType } from '../../models/payment-type.model';
import { firstValueFrom } from 'rxjs';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import { PaymentTypeService } from '../../services/payment-type.service';

@Component({
  selector: 'app-type-payments-list',
  imports: [MatTableModule, MatCardModule, MatButtonModule, MatTooltipModule, MatIconModule],
  templateUrl: './type-payments-list.html',
  styleUrl: './type-payments-list.scss',
})
export class TypePaymentsList implements OnInit {
  private paymentTypeService = inject(PaymentTypeService);
  
  public paymentsTypes = signal<PaymentType[]>([]);

  private snackBar = inject(MatSnackBar);

  private router = inject(Router);

  public displayedColumns: string[] = [
    'idTypePayments',
    'name',
    'actions'
  ];

  ngOnInit(): void {
    this.loadPaymentsTypes();
    this.paymentTypeService.paymentTypeSelected.set(null);
  }

  public async loadPaymentsTypes() {
    try {
      const dados = await firstValueFrom(this.paymentTypeService.loadPaymentTypes());
      this.paymentsTypes.set(dados);
    } catch (erro) {
      console.error('Falha ao buscar os tipos de pagamentos:', erro);
    }
  }

  async deletePaymentType(id: number) {
    console.log(id)
    try {
      const result = await firstValueFrom(this.paymentTypeService.deletePaymentType(id));

      this.snackBar.open('Tipo de pagamento excluído com sucesso!', 'Fechar', {
        duration: 3000, // Some sozinha após 3 segundos
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      const paymentsTypeAfterDelete = this.paymentsTypes().filter((paymentType) =>paymentType.idTypePayments != id);
      this.paymentsTypes.set(paymentsTypeAfterDelete);
    } catch (error) {
      this.snackBar.open('Erro ao excluir o tipo de pagamento', 'Fechar', {
        duration: 3000, // Some sozinha após 3 segundos
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });

    }
  }

  editPaymentType(paymentType: PaymentType) {
    this.paymentTypeService.paymentTypeSelected.set(paymentType);
    this.router.navigate(['/cadastrar-tipos-pagamentos']);
  }
}