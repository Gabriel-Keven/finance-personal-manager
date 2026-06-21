import { inject, Injectable, signal, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MonthlyBalance } from '../models/monthly-balance.model';
import { Observable, tap } from 'rxjs';
import { DecimalPipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class MonthlyBalanceService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/monthly-balance';

  // Cofre de estado global
  public balancesList = signal<MonthlyBalance[]>([]);

  public loadBalances(): Observable<MonthlyBalance[]> {
    return this.http.get<MonthlyBalance[]>(this.apiUrl).pipe(
      tap(balances => this.balancesList.set(balances))
    );
  }

  // Recebe mês e ano e dispara para a rota customizada do Quarkus
  public generateBalance(month: number, year: number): Observable<MonthlyBalance> {
    return this.http.post<MonthlyBalance>(`${this.apiUrl}/${month}/${year}`, {}).pipe(
      tap({
        next: (newBalance: MonthlyBalance) => {
          this.balancesList.update(list => {
            // Verifica se o mês/ano já existe na tela
            const exists = list.some(b => b.month === month && b.year === year);
            
            if (exists) {
              // Se existe (foi um Update), substitui a linha antiga pela nova
              return list.map(b => (b.month === month && b.year === year) ? newBalance : b);
            }
            // Se não existe (foi um Create), adiciona no final da tabela
            return [...list, newBalance];
          });
        },
        error: (error) => {
          console.error("Erro ao gerar o balanço: ", error);
        },
      })
    );
  }

  public deleteBalance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap({
        next: () => {
          // Remove da tela instantaneamente
          this.balancesList.update(list => list.filter(b => b.idMonthlyBalance !== id));
        },
        error: (error) => {
          console.error("Erro ao deletar o balanço: ", error);
        }
      })
    );
  }
}