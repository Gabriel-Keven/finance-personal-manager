import { Component, inject, OnInit, ViewChild, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators, FormGroupDirective } from '@angular/forms';

// Angular Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PaymentType } from '../../models/payment-type.model';
import { PaymentTypeService } from '../../services/payment-type.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-type-payment-form',
  imports: [ReactiveFormsModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  templateUrl: './type-payment-form.html',
  styleUrl: './type-payment-form.scss',
})
export class TypePaymentForm implements OnInit {

  @ViewChild('formDiretiva') formDiretiva!: FormGroupDirective;

  private paymentTypeService = inject(PaymentTypeService);
  private snackBar = inject(MatSnackBar);
  
  tipoPagamentoSelecionado = this.paymentTypeService.paymentTypeSelected();

  typePayment = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ])
  });

  ngOnInit(): void {    
    if (this.tipoPagamentoSelecionado !== null) {
      this.typePayment.patchValue({
        name: this.tipoPagamentoSelecionado.name
      });
    }
  }  
  
  onSubmit(): void {
    if (this.typePayment.invalid) {
      return;
    }
    const nomeDigitado = this.typePayment.value.name || '';

    if (this.tipoPagamentoSelecionado !== null && this.tipoPagamentoSelecionado.idTypePayments) {
      
      const updatePaymentType: PaymentType = {
        idTypePayments: this.tipoPagamentoSelecionado.idTypePayments,
        name: nomeDigitado
      };

      this.paymentTypeService.updatePaymentType(updatePaymentType.idTypePayments!, updatePaymentType).subscribe({
        next: () => {
          this.exibirNotificacao('Tipo de pagamento atualizado com sucesso!');
          this.limparFormulario();
        },
        error: () => {
          this.exibirNotificacao('Erro ao atualizar o tipo de pagamento!');
        }
      });

    } else {
      const newPaymentType: PaymentType = {
        name: nomeDigitado
      };

      this.paymentTypeService.addPaymentType(newPaymentType).subscribe({
        next: () => {
          this.exibirNotificacao('Tipo de pagamento inserido com sucesso!');
          this.limparFormulario();
        },
        error: () => {
          this.exibirNotificacao('Erro ao inserir o tipo de pagamento!');
        }
      });
    }
  }

  // --- Funções Auxiliares para manter o código limpo ---

  private exibirNotificacao(mensagem: string): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  private limparFormulario(): void {
    this.typePayment.reset(); // Zera os valores
    this.formDiretiva.resetForm(); // Limpa os erros visuais vermelhos da tela
    this.paymentTypeService.paymentTypeSelected.set(null); // Esvazia o cofre de edição
  }
}