import { Component, inject, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Income } from '../../models/income.model';
import { CurrencyPipe, DatePipe } from '@angular/common';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


//Services
import { IncomesService } from '../../services/incomes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-incomes-list',
  imports: [MatTableModule, MatCardModule, CurrencyPipe, DatePipe, MatButtonModule, MatTooltipModule, MatIconModule],
  templateUrl: './incomes-list.html',
  styleUrl: './incomes-list.scss'
})
export class IncomesList implements OnInit {

  private incomesService = inject(IncomesService);

  public incomes = signal<Income[]>([]);

  private snackBar = inject(MatSnackBar);

  private router = inject(Router);

  public displayedColumns: string[] = [
    'idIncomes',
    'name',
    'value',
    'dateReceived',
    'description',
    'actions'];

  ngOnInit(): void {
    this.loadIncomes();
  }

  public async loadIncomes() {
    try {
      const dados = await firstValueFrom(this.incomesService.loadIncomes());
      this.incomes.set(dados);
    } catch (erro) {
      console.error('Falha ao buscar o extrato dos ganhos:', erro);
    }
  }

  async deleteButtonClick(id: number) {

    try {
      const result = await firstValueFrom(this.incomesService.deleteIncome(id));

      this.snackBar.open('Ganho excluída com sucesso!', 'Fechar', {
        duration: 3000, // Some sozinha após 3 segundos
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      const incomesAfterDelete = this.incomes().filter((income) => income.idIncomes != id);
      this.incomes.set(incomesAfterDelete);
    } catch (error) {
      this.snackBar.open('Erro ao excluir o ganho', 'Fechar', {
        duration: 3000, // Some sozinha após 3 segundos
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