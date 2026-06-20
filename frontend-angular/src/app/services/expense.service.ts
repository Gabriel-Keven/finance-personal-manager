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

  public expenseSelected = signal<Expense | null>(null);

  public loadExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }

  public deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  public addExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense).pipe(
      tap({
        next: () => {
          // A MÁGICA: Mandamos o Angular recarregar a lista direto do banco.
          // Assim, ele puxa não apenas a despesa original, mas todas as parcelas futuras geradas!
          this.loadExpenses().subscribe();
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

}
