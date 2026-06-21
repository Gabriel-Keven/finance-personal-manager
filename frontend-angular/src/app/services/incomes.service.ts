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

  public deleteIncome(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateIncome(id: number, Income: Income) {
    return this.http.put<Income>(`${this.apiUrl}/${id}`, Income);
  }

  public loadIncomes(year: number, month: number): Observable<Income[]> {
    return this.http.get<Income[]>(`${this.apiUrl}/${year}/${month}`).pipe(
      tap(incomes => this.incomesList.set(incomes))
    );
  }
  public addIncome(Income: Income): Observable<Income> {
    return this.http.post<Income>(this.apiUrl, Income).pipe(
      tap({
        next: () => {
          // Extrai o mês e ano da data atual para recarregar a lista correta
          const dataAtual = new Date();
          this.loadIncomes(dataAtual.getFullYear(), dataAtual.getMonth() + 1).subscribe();
        },
        error: (error) => {
          console.error("Erro ao inserir despesa: ", error);
        }
      })
    );
  }

}
