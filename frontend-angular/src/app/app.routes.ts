import { Routes } from '@angular/router';
import { ExpenseForm } from './components/exepense-form/expense-form';
import { ExpenseList } from './components/expense-list/expense-list';
import { TopicForm } from './components/topic-form/topic-form';
import { TopicList } from './components/topic-list/topic-list';
import { TypePaymentForm } from './components/type-payment-form/type-payment-form';
import { TypePaymentsList } from './components/type-payments-list/type-payments-list';
import { IncomesForm } from './components/incomes-form/incomes-form';
import { IncomesList } from './components/incomes-list/incomes-list';

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
  {
    path: 'cadastrar-topicos',
    component: TopicForm
  },
  {
    path: 'listar-topicos',
    component: TopicList
  },
  {
    path: 'cadastrar-tipos-pagamentos',
    component: TypePaymentForm
  },
  {
    path: 'listar-tipos-pagamentos',
    component: TypePaymentsList
  },
  {
    path: 'cadastrar-rendas',
    component: IncomesForm
  },
  {
    path: 'listar-rendas',
    component: IncomesList
  },
  { 
    path: '**', 
    redirectTo: 'extrato' 
  }
];
