import { Component, inject, OnInit, signal } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.model';
import { firstValueFrom } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-expense-list',
  imports: [MatTableModule, MatCardModule, CurrencyPipe, DatePipe, MatButtonModule,MatTooltipModule,MatIconModule], 
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.scss'
})
export class ExpenseList implements OnInit {
  
  private expenseService = inject(ExpenseService);

  public expenses = signal<Expense[]>([]);

  public displayedColumns: string[] = [
    'idExpenses',
    'name', 
    'value', 
    'datePurchase', 
    'paid', 
    'monthly',
    'installment',
    'numberInstallments',
    'valueInstallments',
    'topic',
    'paymentType',
    'actions'];

  ngOnInit(): void {
    this.carregarDespesas();
  }

  public async carregarDespesas() {
    try {
      const dados = await firstValueFrom(this.expenseService.loadExpenses());
      console.log(dados);
      this.expenses.set(dados);
    } catch (erro) {
      console.error('Falha ao buscar o extrato de despesas:', erro);
    }
  }

  deleteButtonClick(id: number):void{
    console.log('Clicou', id);
  }

}