import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Expense } from '../models/expense.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {

  //Injeção de dependência
  private http = inject(HttpClient);

  //URL da api do backend
  private apiUrl = 'http://localhost:8080/expenses';

  public expensesList = signal<Expense[]>([]);

  public loadExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }

  public addExpense(expense: Expense):Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense).pipe(
      tap({
        next: (expenseInserted: Expense) => {
          // O serviço espiona o sucesso e atualiza a lista interna dele
          this.expensesList.update(expensesList => [...expensesList, expenseInserted]);
        },
        error: (error) => {
          console.error("Erro ao inserir despesa: ", error);
        }
      })
    );
  }

}
