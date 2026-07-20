import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BaseChartDirective} from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';

// Chart.js
import {ChartConfiguration, ChartData, ChartType} from 'chart.js'

@Component({
  selector: 'app-graphs-monthly-balance',
  imports: [CommonModule, BaseChartDirective, MatCardModule],
  templateUrl: './graphs-monthly-balance.html',
  styleUrl: './graphs-monthly-balance.scss',
})
export class GraphsMonthlyBalance {

  @Input() pieChartData!: ChartData<'pie', number[], string | string[]>;
  public pieChartType: ChartType = 'pie';
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { position: 'right' } }
  };

  @Input() barChartData!: ChartData<'bar'>;
  public barChartType: ChartType = 'bar';
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };

}
