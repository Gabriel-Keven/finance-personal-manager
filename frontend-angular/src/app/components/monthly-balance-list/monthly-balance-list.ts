import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, DecimalPipe, NgClass } from '@angular/common';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Serviço
import { MonthlyBalanceService } from '../../services/monthly-balance.service';

@Component({
  selector: 'app-monthly-balance-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    CurrencyPipe,
    DecimalPipe,
    NgClass
  ],
  templateUrl: './monthly-balance-list.html',
  styleUrl: './monthly-balance-list.scss'
})
export class MonthlyBalanceList implements OnInit {

  private monthlyBalanceService = inject(MonthlyBalanceService);
  private snackBar = inject(MatSnackBar);

  public balancesList = this.monthlyBalanceService.balancesList;

  public displayedColumns: string[] = ['month', 'year', 'totalIncomes', 'totalExpenses', 'finalBalance', 'status', 'actions'];

  // 3. Listas para preencher os Selects do Formulário
  public months = [
    { value: 1, label: 'Janeiro' }, { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' }, { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' }, { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' }, { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' }, { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' }, { value: 12, label: 'Dezembro' }
  ];

  public years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

  balanceForm = new FormGroup({
    month: new FormControl<number | null>(null, Validators.required),
    year: new FormControl<number | null>(null, Validators.required)
  });

  ngOnInit(): void {
    this.monthlyBalanceService.loadBalances().subscribe({
      error: () => this.exibirNotificacao('Erro ao carregar o histórico de balanços.')
    });
  }

  onSubmit(): void {
    if (this.balanceForm.invalid) {
      return;
    }

    // Extrai os valores usando o "!" pois o Validators.required garante que não são nulos
    const month = this.balanceForm.value.month!;
    const year = this.balanceForm.value.year!;

    this.monthlyBalanceService.generateBalance(month, year).subscribe({
      next: () => {
        this.exibirNotificacao(`Balanço de ${month}/${year} gerado com sucesso!`);
        this.balanceForm.reset();
      },
      error: () => {
        this.exibirNotificacao('Erro ao processar o cálculo no servidor!');
      }
    });
  }

  deleteBalance(id: number | undefined): void {
    if (!id) return;

    if (confirm('Tem certeza que deseja excluir este balanço da sua visão geral?')) {
      this.monthlyBalanceService.deleteBalance(id).subscribe({
        next: () => this.exibirNotificacao('Balanço excluído com sucesso!'),
        error: () => this.exibirNotificacao('Erro ao excluir o balanço.')
      });
    }
  }

  private exibirNotificacao(mensagem: string): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}