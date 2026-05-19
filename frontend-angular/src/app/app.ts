import { Component, inject, OnInit } from '@angular/core';
import { ExpenseService } from './services/expense.service';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1>Painel de Testes 🚀</h1>
      <p>Abra o console do navegador (tecla F12) para ver a comunicação com o servidor.</p>
    </div>
  `
})
export class App implements OnInit {
  
  // 1. O técnico pede a ferramenta ao almoxarifado
  private expenseService = inject(ExpenseService);

  // 2. Este método roda automaticamente quando a tela carrega
  ngOnInit(): void {
    // Mantém a leitura inicial
    console.log('Iniciando teste de leitura...');
    this.expenseService.loadExpenses();

    // Descomente e ajuste o teste de gravação (POST)
    console.log('Iniciando envio de comando (POST)...');
    
    // ATENÇÃO: Repare que NÃO enviamos o 'id'. O Quarkus vai gerar isso!
    // this.expenseService.addExpense({
    //   name: 'Compra de Componentes',
    //   description: 'Arduino e relés para automação',
    //   value: 120.50,
    //   datePurchase: '2026-05-19', // Formato YYYY-MM-DD exigido pelo banco
    //   hourPurchase: '14:30',
    //   paid: true,
    //   monthly: false,
    //   installment: false,
    //   // Troque os IDs abaixo pelos que realmente existem nas suas tabelas de Topic e PaymentType
    //   topic: { idTopics: 1, name: 'Eletrônicos' }, 
    //   typePayment: { idTypePayments: 1, name: 'Pix' } 
    // });
  }
}