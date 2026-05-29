import { Routes } from '@angular/router';
import { ExpenseForm } from './components/exepense-form/expense-form';
import { ExpenseList } from './components/expense-list/expense-list';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'extrato', 
    pathMatch: 'full' 
  },
  { 
    path: 'extrato', 
    component: ExpenseList 
  },
  { 
    path: 'cadastrar', 
    component: ExpenseForm 
  },
  // Rota de segurança: se digitar URL errada, volta pro extrato
  { 
    path: '**', 
    redirectTo: 'extrato' 
  }
];
