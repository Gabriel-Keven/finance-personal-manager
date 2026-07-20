import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Expense } from '../models/expense.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/expenses';

  public expensesList = signal<Expense[]>([]);
  public expenseSelected = signal<Expense | null>(null);

  // Agora recebe os parâmetros de filtro e envia para a URL
  public loadExpenses(year: number, month: number): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/${year}/${month}`).pipe(
      tap(expenses => this.expensesList.set(expenses))
    );
  }

  public deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  public addExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense).pipe(
      tap({
        next: () => {
          // Após salvar (e o Quarkus gerar as parcelas), recarregamos a lista do mês atual
          const dataAtual = new Date();
          this.loadExpenses(dataAtual.getFullYear(), dataAtual.getMonth() + 1).subscribe();
        },
        error: (error) => {
          console.error("Erro ao inserir despesa: ", error);
        }
      })
    );
  }

  updateExpense(id: number, expense: Expense) {
    return this.http.put<Expense>(`${this.apiUrl}/${id}`, expense);
  }

  cloneFixedEpenses(year: number, month:number){
    return this.http.post(`${this.apiUrl}/clone/${year}/${month}`,null);
  }
}