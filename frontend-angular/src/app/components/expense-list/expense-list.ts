import { Component, inject, OnInit, signal, effect, computed } from '@angular/core';
import { Expense } from '../../models/expense.model';
import { firstValueFrom } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

//Services
import { ExpenseService } from '../../services/expense.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    MatTableModule, MatCardModule, CurrencyPipe, DatePipe, 
    MatButtonModule, MatTooltipModule, MatIconModule,
    MatSelectModule, MatFormFieldModule
  ],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.scss'
})
export class ExpenseList implements OnInit {

  private expenseService = inject(ExpenseService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  // 1. Controle dos Filtros
  private dataAtual = new Date();
  public mesSelecionado = signal<number>(this.dataAtual.getMonth() + 1);
  public anoSelecionado = signal<number>(this.dataAtual.getFullYear());
  public statusSelecionado = signal<string>('TODOS'); 

  // 2. A LISTA FILTRADA AUTOMÁTICA
  public despesasFiltradas = computed(() => {
    const listaBruta = this.expenseService.expensesList();
    const status = this.statusSelecionado();

    if (status === 'PAGOS') {
      return listaBruta.filter(despesa => despesa.paid === true);
    }
    if (status === 'PENDENTES') {
      return listaBruta.filter(despesa => despesa.paid === false);
    }
    
    return listaBruta;
  });

  // 3. A SOMA AUTOMÁTICA (Resumo do Mês)
  public totalDespesas = computed(() => {
    return this.despesasFiltradas().reduce((soma, despesa) => soma + despesa.value, 0);
  });

  // 4. Arrays para os Selects
  public meses = [
    { value: 1, label: 'Janeiro' }, { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' }, { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' }, { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' }, { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' }, { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' }, { value: 12, label: 'Dezembro' }
  ];
  public anos = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

  public displayedColumns: string[] = [
    'idExpense', 'name', 'value', 'datePurchase', 'paid', 'monthly',
    'installment', 'numberInstallments', 'valueInstallments', 'topic',
    'paymentType', 'actions'
  ];

  constructor() {
    effect(() => {
      this.expenseService.loadExpenses(this.anoSelecionado(), this.mesSelecionado()).subscribe();
    });
  }

  ngOnInit(): void {}

  async deleteButtonClick(id: number) {
    try {
      await firstValueFrom(this.expenseService.deleteExpense(id));

      this.snackBar.open('Despesa excluída com sucesso!', 'Fechar', {
        duration: 3000, 
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-sucesso'] 
      });
      
      this.expenseService.loadExpenses(this.anoSelecionado(), this.mesSelecionado()).subscribe();
      
    } catch (error) {
      this.snackBar.open('Erro ao excluir a despesa', 'Fechar', {
        duration: 3000, 
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-erro'] 
      });
    }
  }

  editExpense(expense: Expense) {
    this.expenseService.expenseSelected.set(expense);
    this.router.navigate(['/cadastrar']);
  }
}