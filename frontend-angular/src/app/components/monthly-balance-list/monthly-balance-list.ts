import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { GraphsMonthlyBalance } from '../graphs-monthly-balance/graphs-monthly-balance';
import { ChartData } from 'chart.js';

import { ExpenseService } from '../../services/expense.service';
import { IncomesService } from '../../services/incomes.service';

@Component({
  selector: 'app-monthly-balance-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, CurrencyPipe, DatePipe, GraphsMonthlyBalance],
  templateUrl: './monthly-balance-list.html',
  styleUrl: './monthly-balance-list.scss'
})
export class MonthlyBalanceList implements OnInit {

  private expenseService = inject(ExpenseService);
  private incomesService = inject(IncomesService);

  // Sinais de Resumo
  public totalRendas = signal<number>(0);
  public totalDespesas = signal<number>(0);
  public saldoAtual = signal<number>(0);

  // Controle do Mês Selecionado (Formato YYYY-MM)
  public mesAnoInput = signal<string>('');

  // Listas para a "Visualização Antiga" (Tabelas)
  public despesasLista = signal<any[]>([]);
  public rendasLista = signal<any[]>([]);

  // Gráficos
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [], datasets: [{ data: [] }]
  };
  public barChartData: ChartData<'bar'> = {
    labels: ['Balanço do Mês'],
    datasets: [
      { data: [0], label: 'Rendas', backgroundColor: '#4caf50' },
      { data: [0], label: 'Despesas', backgroundColor: '#f44336' }
    ]
  };

  ngOnInit(): void {
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth() + 1;
    
    // Define o valor inicial do input de mês (ex: "2026-08")
    this.mesAnoInput.set(`${ano}-${mes.toString().padStart(2, '0')}`);
    
    this.carregarDadosDoMes(ano, mes);
  }

  // Função chamada quando o usuário troca o mês na tela
  public mudarMes(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    if (input) {
      this.mesAnoInput.set(input);
      const [ano, mes] = input.split('-');
      this.carregarDadosDoMes(parseInt(ano), parseInt(mes));
    }
  }

  private async carregarDadosDoMes(ano: number, mes: number) {
    try {
      const [despesas, rendas] = await Promise.all([
        firstValueFrom(this.expenseService.loadExpenses(ano, mes)),
        firstValueFrom(this.incomesService.loadIncomes(ano, mes))
      ]);

      // Guarda os dados para a tabela HTML
      this.despesasLista.set(despesas);
      this.rendasLista.set(rendas);

      // Calcula os Totais
      const somaDespesas = despesas.reduce((acc, d) => acc + d.value, 0);
      const somaRendas = rendas.reduce((acc, r) => acc + r.value, 0);

      this.totalDespesas.set(somaDespesas);
      this.totalRendas.set(somaRendas);
      this.saldoAtual.set(somaRendas - somaDespesas);

      // Atualiza Gráfico de Barras
      this.barChartData.datasets[0].data = [somaRendas];
      this.barChartData.datasets[1].data = [somaDespesas];
      this.barChartData = { ...this.barChartData };

      // Atualiza Gráfico de Pizza
      const gastosPorTopico: { [key: string]: number } = {};
      despesas.forEach(d => {
        const nomeTopico = d.topic ? d.topic.name : 'Outros';
        if (gastosPorTopico[nomeTopico]) {
          gastosPorTopico[nomeTopico] += d.value;
        } else {
          gastosPorTopico[nomeTopico] = d.value;
        }
      });

      this.pieChartData.labels = Object.keys(gastosPorTopico);
      this.pieChartData.datasets[0].data = Object.values(gastosPorTopico);

      this.pieChartData.datasets[0].backgroundColor = [
        '#FF6384', // Rosa/Vermelho
        '#36A2EB', // Azul
        '#FFCE56', // Amarelo
        '#4BC0C0', // Verde Água
        '#9966FF', // Roxo
        '#FF9F40', // Laranja
        '#8D6E63', // Marrom
        '#009688'  // Verde Escuro
      ];

      this.pieChartData = { ...this.pieChartData };

    } catch (error) {
      console.error('Erro ao montar o Dashboard', error);
    }
  }
}