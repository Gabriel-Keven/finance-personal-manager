import { Component, inject, OnInit, signal } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.model';
import { firstValueFrom } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-expense-list',
  // Importamos os Pipes de data e moeda para formatar os valores automaticamente
  imports: [MatTableModule, MatCardModule, CurrencyPipe, DatePipe], 
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.scss'
})
export class ExpenseList implements OnInit {
  
  private expenseService = inject(ExpenseService);

  // 1. Sinal que vai guardar a nossa tabela de dados
  public expenses = signal<Expense[]>([]);

  // 2. Definimos quais colunas aparecerão na tela e a ordem delas
  public displayedColumns: string[] = ['name', 'value', 'datePurchase', 'paid'];

  // 3. Assim que o componente nascer, ele manda buscar os dados
  ngOnInit(): void {
    this.carregarDespesas();
  }

  // 4. A função que vai até o Quarkus puxar o histórico
  public async carregarDespesas() {
    try {
      // Usamos o firstValueFrom para aguardar a resposta da API perfeitamente
      const dados = await firstValueFrom(this.expenseService.loadExpenses());
      
      // Injetamos os dados que chegaram do banco dentro do nosso Sinal
      this.expenses.set(dados);
    } catch (erro) {
      console.error('Falha ao buscar o extrato de despesas:', erro);
    }
  }
}