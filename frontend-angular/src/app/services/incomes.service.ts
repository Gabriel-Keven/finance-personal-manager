import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Income } from '../models/income.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IncomesService {

  //Injeção de dependência
  private http = inject(HttpClient);

  //URL da api do backend
  private apiUrl = 'http://localhost:8080/incomes';

  public incomesList = signal<Income[]>([]);

  public incomesSelected = signal<Income | null>(null);

  public loadIncomes(): Observable<Income[]> {
    return this.http.get<Income[]>(this.apiUrl);
  }

  public deleteIncome(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  public addIncome(Income: Income): Observable<Income> {
    return this.http.post<Income>(this.apiUrl, Income).pipe(
      tap({
        next: (IncomeInserted: Income) => {
          this.incomesList.update(incomesList => [...incomesList, IncomeInserted]);
        },
        error: (error) => {
          console.error("Erro ao inserir despesa: ", error);
        }
      })
    );
  }
  updateIncome(id: number, Income: Income) {
    return this.http.put<Income>(`${this.apiUrl}/${id}`, Income);
  }

}
