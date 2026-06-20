import { Component, inject, OnInit, signal } from '@angular/core';
import { Income } from '../../models/income.model';
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
import { IncomesService } from '../../services/incomes.service';

@Component({
  selector: 'app-incomes-form',
  imports: [FormField, FormRoot, MatFormFieldModule, MatInputModule, MatSelectModule, MatCardModule, MatButtonModule, MatDatepickerModule, MatTimepickerModule, MatSnackBarModule],
  templateUrl: './incomes-form.html',
  styleUrl: './incomes-form.scss',
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }]
})
export class IncomesForm implements OnInit {

  //Services
  private incomesService = inject(IncomesService);
  private snackBar = inject(MatSnackBar);

  public incomesList = this.incomesService.incomesList

  //Criação do formulário
  incomeModel = signal<Income>({
    name: '',
    description: '',
    value: 0,
    dateReceived: null
  });

  incomeForm = form(this.incomeModel, (schemaPath) => {

    required(schemaPath.name, {
      message: 'O nome do ganho é obrigatório.'
    });

    maxLength(schemaPath.description, 255, {
      message: 'A descrição não pode ultrapassar 255 caracteres.'
    });

    required(schemaPath.value, {
      message: 'O valor do ganho é obrigatório.'
    });

    min(schemaPath.value, 0.01, {
      message: 'Insira um valor maior que zero.'
    });

    required(schemaPath.dateReceived, {
      message: 'A data da compra é obrigatória.'
    });

  }, {
    submission: {
      action: async (field) => {
        try {
          const valuesForms = field().value();
          const newIncome = { ...valuesForms };
          // 3. TRATAMENTO DA DATA (Transforma para "YYYY-MM-DD")

          if (newIncome.dateReceived) {
            const data = new Date(newIncome.dateReceived);
            const ano = data.getFullYear();
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const dia = String(data.getDate()).padStart(2, '0');

            newIncome.dateReceived = `${ano}-${mes}-${dia}`;
          }
          if (newIncome.idIncomes) {
            
            // MODO EDIÇÃO (PUT)
            await firstValueFrom(this.incomesService.updateIncome(newIncome.idIncomes, newIncome));
            
            this.snackBar.open('Ganho atualizado com sucesso!', 'Fechar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['snackbar-sucesso']
            });

          } else {
            
            await firstValueFrom(this.incomesService.addIncome(newIncome));
            
            this.snackBar.open('Ganho cadastrado com sucesso!', 'Fechar', {
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

          let mensagemErro = 'Erro ao cadastrar o ganho. Verifique os dados.';

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
    this.incomeModel.set({
      name: '',
      description: '',
      value: 0,
      dateReceived: null,
    });
    this.incomeForm().reset();
  }

  //Quando as variáveis carregarem chama as funções GET de topic e payment type
  ngOnInit(): void {
    const incomeForEdit = this.incomesService.incomesSelected();

    if (incomeForEdit) {

      const despesaFormatada = { ...incomeForEdit };

      // 2. Converte a Data da Compra de volta para Date
      if (despesaFormatada.dateReceived) {
        despesaFormatada.dateReceived = new Date(`${despesaFormatada.dateReceived}T00:00:00`) as any;
      }
      this.incomeForm().value.set(despesaFormatada);
      this.incomesService.incomesSelected.set(null);
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
