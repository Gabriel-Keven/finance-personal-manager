import { Component, inject, OnInit, signal } from '@angular/core';
import { Expense } from '../../models/expense.model';
import { form, FormField, required, min, maxLength, validate, FormRoot, } from '@angular/forms/signals';
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

//Services
import { TopicService } from '../../services/topic.service';
import { PaymentTypeService } from '../../services/payment-type.service';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-expense-form',
  imports: [FormField, FormRoot, MatFormFieldModule, MatInputModule, MatSelectModule, MatCardModule, MatButtonModule, MatDatepickerModule, MatTimepickerModule, MatSnackBarModule],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.scss',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }]
})
export class ExpenseForm implements OnInit {

  //Services
  private topicService = inject(TopicService);
  private paymentTypeService = inject(PaymentTypeService);
  private expenseService = inject(ExpenseService);
  private snackBar = inject(MatSnackBar);

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
    paymentType: {
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


    validate(schemaPath.topic, (ctx) => {
      const categoriaSelecionada = ctx.value();

      // Se não houver categoria, ou se o ID ainda for 0 (o nosso valor inicial em branco)
      if (!categoriaSelecionada || categoriaSelecionada.idTopics === 0) {
        return { kind: 'required', message: 'Selecione uma categoria para a despesa.' };
      }
      return null;
    });

    validate(schemaPath.paymentType, (ctx) => {
      const pagamentoSelecionado = ctx.value();

      // Se não houver pagamento, ou se o ID ainda for 0
      if (!pagamentoSelecionado || pagamentoSelecionado.idTypePayments === 0) {
        return { kind: 'required', message: 'Selecione a forma de pagamento.' };
      }
      return null;
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

          if (newExpense.installment === false) {
            newExpense.numberInstallments = null as any;
            newExpense.valueInstallments = null as any;
          }

          if (newExpense.idExpense) {
            
            // MODO EDIÇÃO (PUT)
            await firstValueFrom(this.expenseService.updateExpense(newExpense.idExpense, newExpense));
            
            this.snackBar.open('Despesa atualizada com sucesso!', 'Fechar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['snackbar-sucesso']
            });

          } else {
            
            // MODO CADASTRO (POST)
            await firstValueFrom(this.expenseService.addExpense(newExpense));
            
            this.snackBar.open('Despesa cadastrada com sucesso!', 'Fechar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['snackbar-sucesso']
            });
            
          }

          // Zera a tela após o sucesso
          this.cleanForm();
        } catch (erro: any) {
          console.error('Falha ao comunicar com a API:', erro);

          // 1. Mensagem genérica como plano B
          let mensagemErro = 'Erro ao cadastrar a despesa. Verifique os dados.';

          // 2. Aponta o radar direto para a propriedade 'detail' do Quarkus
          if (erro.error && erro.error.detail) {
            mensagemErro = erro.error.detail;
          }
          // 3. Fallback de segurança
          else if (erro.error && typeof erro.error === 'string') {
            mensagemErro = erro.error;
          }

          // 4. Exibe no SnackBar
          this.snackBar.open(mensagemErro, 'Fechar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-erro']
          });
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
      paymentType: { idTypePayments: 0, name: '' }
    });
    this.expenseForm().reset();
  }

 ngOnInit(): void {
    
    // CORREÇÃO: Adicionado o .subscribe() para disparar as requisições
    this.topicService.loadTopics().subscribe();
    this.paymentTypeService.loadPaymentTypes().subscribe();
    
    const expenseForEdit = this.expenseService.expenseSelected();

    if (expenseForEdit) {
      const despesaFormatada = { ...expenseForEdit };

      // 2. Converte a Data da Compra de volta para Date
      if (despesaFormatada.datePurchase) {
        despesaFormatada.datePurchase = new Date(`${despesaFormatada.datePurchase}T00:00:00`) as any;
      }

      // 3. Converte a Hora da Compra de volta para Date
      if (despesaFormatada.hourPurchase) {
        despesaFormatada.hourPurchase = new Date(`1970-01-01T${despesaFormatada.hourPurchase}`) as any;
      }
      
      this.expenseForm().value.set(despesaFormatada);
      this.expenseService.expenseSelected.set(null);
    }
  }

  showErros(inputForm: any): string | null {
    if (inputForm().touched() && inputForm().invalid()) {

      const errors = inputForm().errors();

      if (errors && errors.length > 0) {

        return errors[0].message;
      }
    }
    return null;
  }
  // Função para comparar os objetos de Tópicos pelo ID
  compareTopics(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.idTopics === o2.idTopics : o1 === o2;
  }

  // Função para comparar as Formas de Pagamento pelo ID
  comparePayments(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.idTypePayments === o2.idTypePayments : o1 === o2;
  }
}
