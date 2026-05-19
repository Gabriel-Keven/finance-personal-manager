import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {

  //Injeção de dependência
  private http = inject(HttpClient);

  //URL da api do backend
  private apiUrl = 'http://localhost:8080/expenses';

  public expensesList = signal<Expense[]>([]);

  public loadExpenses(): void {
    this.http.get<Expense[]>(this.apiUrl).subscribe({
      next: (expenses) =>{
        this.expensesList.set(expenses);
        console.log("Despensas chegaram com sucesso!");
      },
      error:(error) =>{
        console.log("Erro: ",error);
      }
    });
  }

  public addExpense(expense: Expense):void {
    this.http.post<Expense>(this.apiUrl,expense).subscribe({
      next:(expenseInserted: Expense) => {
        this.expensesList.update(expensesList => [...expensesList, expenseInserted]);
      },
      error:(error)=> {
        console.log("Erro: ", error);
      }
    })
  }

}
