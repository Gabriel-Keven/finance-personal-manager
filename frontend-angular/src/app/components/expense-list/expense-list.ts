import { Component, inject, OnInit, signal } from '@angular/core';
import { Expense } from '../../models/expense.model';
import { firstValueFrom } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


//Services
import { ExpenseService } from '../../services/expense.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expense-list',
  imports: [MatTableModule, MatCardModule, CurrencyPipe, DatePipe, MatButtonModule, MatTooltipModule, MatIconModule],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.scss'
})
export class ExpenseList implements OnInit {

  private expenseService = inject(ExpenseService);

  public expenses = signal<Expense[]>([]);

  private snackBar = inject(MatSnackBar);

  private router = inject(Router);

  public displayedColumns: string[] = [
    'idExpense',
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
      this.expenses.set(dados);
    } catch (erro) {
      console.error('Falha ao buscar o extrato de despesas:', erro);
    }
  }

  async deleteButtonClick(id: number) {

    try {
      const result = await firstValueFrom(this.expenseService.deleteExpense(id));

      this.snackBar.open('Despesa excluída com sucesso!', 'Fechar', {
        duration: 3000, // Some sozinha após 3 segundos
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-sucesso'] // Chama o CSS verde
      });
      console.log("Atual: ", this.expenses());
      const expeseseAfterDelete = this.expenses().filter((expense) => expense.idExpense != id);
      console.log(" expeseseAfterDelete", expeseseAfterDelete);
      this.expenses.set(expeseseAfterDelete);
    } catch (error) {
      this.snackBar.open('Erro ao excluir a despesa', 'Fechar', {
        duration: 3000, // Some sozinha após 3 segundos
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-erro'] // Chama o CSS verde
      });

    }
  }

  editExpense(expense: Expense) {
    this.expenseService.expenseSelected.set(expense);
    this.router.navigate(['/cadastrar']);
  }

}