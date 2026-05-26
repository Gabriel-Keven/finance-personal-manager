import { Component, inject, OnInit, signal } from '@angular/core';
import { Expense } from '../../models/expense.model';
import { form, FormField, required, min, maxLength, validate, FormRoot } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

// Angular Material
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';

//Services
import { TopicService } from '../../services/topic.service';
import { PaymentTypeService } from '../../services/payment-type.service';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-expense-form',
  imports: [FormField, FormRoot, MatFormFieldModule, MatInputModule, MatSelectModule, MatCardModule, MatButtonModule, MatDatepickerModule, MatTimepickerModule],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.scss',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }]
})
export class ExpenseForm implements OnInit {

  //Services
  private topicService = inject(TopicService);
  private paymentTypeService = inject(PaymentTypeService);
  private expenseService = inject(ExpenseService);

  public topicsList = this.topicService.topicsList;
  public paymentsTypeList = this.paymentTypeService.typePaymentsList;

  //Criação do formulário
  expenseModel = signal<Expense>({
    name: '',
    description: '',
    value: 0,
    datePurchase: null,
    hourPurchase: null,
    paid: false,
    monthly: false,
    installment: false,
    numberInstallments: 0,
    valueInstallments: 0,
    topic: {
      idTopics: 0,
      name: '',
    },
    typePayment: {
      idTypePayments: 0,
      name: ''
    }
  });

  expenseForm = form(this.expenseModel, (schemaPath) => {

    required(schemaPath.name, {
      message: 'O nome da despesa é obrigatório.'
    });

    maxLength(schemaPath.description, 255, {
      message: 'A descrição não pode ultrapassar 255 caracteres.'
    });

    required(schemaPath.value, {
      message: 'O valor da despesa é obrigatório.'
    });

    min(schemaPath.value, 0.01, {
      message: 'Insira um valor maior que zero.'
    });

    required(schemaPath.datePurchase, {
      message: 'A data da compra é obrigatória.'
    });

    required(schemaPath.hourPurchase, {
      message: 'A hora da compra é obrigatória.'
    });

    required(schemaPath.topic, {
      message: 'Selecione uma categoria para a despesa.'
    });

    required(schemaPath.typePayment, {
      message: 'Selecione a forma de pagamento.'
    });

    validate(schemaPath.numberInstallments, (ctx) => {

      if (ctx.valueOf(schemaPath.installment) === true) {

        // Pega o que o usuário digitou no campo de parcelas
        const parcelas = ctx.value();

        // Se estiver zerado, nulo, ou for menor que 2, dispara a sirene
        if (!parcelas || parcelas < 2) {
          return { kind: 'min', message: 'Uma compra parcelada exige no mínimo 2 parcelas.' };
        }
      }

      // Se a compra não for parcelada (ou se os dados estiverem certos), retorna null (sem erros)
      return null;
    });

    validate(schemaPath.valueInstallments, (ctx) => {

      if (ctx.valueOf(schemaPath.installment) === true) {

        const valor = ctx.value();

        if (!valor || valor < 0.01) {
          return { kind: 'min', message: 'O valor da parcela deve ser maior que zero.' };
        }
      }
      return null;
    });
    // Só exige o Valor da Parcela se a compra for parcelada

 }, {
    // 4. A mágica do FormRoot vai acionar esta ação automaticamente!
    submission: {
      action: async (field) => {
        try {
          // field().value() contém os dados extraídos, validados e prontos!
          const valuesForms = field().value();

          const newExpense = { ...valuesForms };

          // 3. TRATAMENTO DA DATA (Transforma para "YYYY-MM-DD")
          if (newExpense.datePurchase) {
            const data = new Date(newExpense.datePurchase);
            const ano = data.getFullYear();
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const dia = String(data.getDate()).padStart(2, '0');
            
            newExpense.datePurchase = `${ano}-${mes}-${dia}`;
          }

          // 4. TRATAMENTO DA HORA (Transforma para "HH:mm:ss")
          if (newExpense.hourPurchase) {
            const hora = new Date(newExpense.hourPurchase);
            const horas = String(hora.getHours()).padStart(2, '0');
            const minutos = String(hora.getMinutes()).padStart(2, '0');
            const segundos = String(hora.getSeconds()).padStart(2, '0');
            
            newExpense.hourPurchase = `${horas}:${minutos}:${segundos}`;
          }

          // Se a compra NÃO for parcelada, limpamos o lixo residual.
          // Forçamos para 'null' para o banco de dados ficar limpo.
          // Usamos 'as any' para o TypeScript aceitar injetar null num campo do tipo number.
          if (newExpense.installment === false) {
            newExpense.numberInstallments = null as any;
            newExpense.valueInstallments = null as any;
          }
          
          // Dispara para o Quarkus usando a injeção do seu Service
          const resposta = await firstValueFrom(this.expenseService.addExpense(newExpense));
          console.log('Sucesso! Despesa salva no banco:', resposta);
          
          // Zera a tela após o sucesso
          this.cleanForm(); 
        } catch (erro) {
          console.error('Falha ao comunicar com a API:', erro);
        }
      }
    }
  });

  private cleanForm(): void {
    // Ao dar .set() com dados em branco, a tela inteira se apaga instantaneamente
    this.expenseModel.set({
      name: '',
      description: '',
      value: 0,
      datePurchase: null,
      hourPurchase: null,
      paid: false,
      monthly: false,
      installment: false,
      numberInstallments: 0,
      valueInstallments: 0,
      topic: { idTopics: 0, name: '' },
      typePayment: { idTypePayments: 0, name: '' }
    });
  }

  //Quando as variáveis carregarem chama as funções GET de topic e payment type
  ngOnInit(): void {
    this.topicService.loadTopics();
    this.paymentTypeService.loadPaymentTypes();
  }

  showErros(inputForm: any):String|null{
    if(inputForm.touched && inputForm.invalid){
      const errors = inputForm.errors();
      if(errors && errors.lenght > 0){
        return errors.message;
      }
    }
    return null;
  }
}
