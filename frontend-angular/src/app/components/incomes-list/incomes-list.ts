import { Component, inject, OnInit, signal, effect, computed } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Income } from '../../models/income.model';
import { CurrencyPipe, DatePipe } from '@angular/common';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 

//Services
import { IncomesService } from '../../services/incomes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-incomes-list',
  standalone: true,
  imports: [
    MatTableModule, MatCardModule, CurrencyPipe, DatePipe, 
    MatButtonModule, MatTooltipModule, MatIconModule,
    MatSelectModule, MatFormFieldModule
  ],
  templateUrl: './incomes-list.html',
  styleUrl: './incomes-list.scss'
})
export class IncomesList implements OnInit {

  private incomesService = inject(IncomesService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  private dataAtual = new Date();
  public mesSelecionado = signal<number>(this.dataAtual.getMonth() + 1);
  public anoSelecionado = signal<number>(this.dataAtual.getFullYear());

  public incomesLista = this.incomesService.incomesList;

  // SOMA AUTOMÁTICA (Resumo de Ganhos do Mês)
  public totalGanhos = computed(() => {
    return this.incomesLista().reduce((soma, ganho) => soma + ganho.value, 0);
  });

  public meses = [
    { value: 1, label: 'Janeiro' }, { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' }, { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' }, { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' }, { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' }, { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' }, { value: 12, label: 'Dezembro' }
  ];
  public anos = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

  public displayedColumns: string[] = [
    'idIncomes',
    'name',
    'value',
    'dateReceived',
    'description',
    'actions'
  ];

  constructor() {
    effect(() => {
      this.incomesService.loadIncomes(this.anoSelecionado(), this.mesSelecionado()).subscribe();
    });
  }

  ngOnInit(): void {
  }

  async deleteButtonClick(id: number) {
    try {
      await firstValueFrom(this.incomesService.deleteIncome(id));

      this.snackBar.open('Ganho excluído com sucesso!', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      
      this.incomesService.loadIncomes(this.anoSelecionado(), this.mesSelecionado()).subscribe();
      
    } catch (error) {
      this.snackBar.open('Erro ao excluir o ganho', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }
  }

  editIncome(income: Income) {
    this.incomesService.incomesSelected.set(income);
    this.router.navigate(['/cadastrar-rendas']);
  }
}