import { Routes } from '@angular/router';
import { ExpenseForm } from './components/exepense-form/expense-form';
import { ExpenseList } from './components/expense-list/expense-list';
import { TopicForm } from './components/topic-form/topic-form';
import { TopicList } from './components/topic-list/topic-list';
import { TypePaymentForm } from './components/type-payment-form/type-payment-form';
import { TypePaymentsList } from './components/type-payments-list/type-payments-list';
import { IncomesForm } from './components/incomes-form/incomes-form';
import { IncomesList } from './components/incomes-list/incomes-list';
import { MonthlyBalanceList } from './components/monthly-balance-list/monthly-balance-list';
import { authGuard } from './auth.guard';
import { LoginComponent } from './components/login.component/login.component';


export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  // 2. A ROTA QUE FALTAVA (Livre de bloqueios, sem o canActivate)
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'balance',
    component: MonthlyBalanceList,
    canActivate: [authGuard]
  },
  { 
    path: 'extrato', 
    component: ExpenseList,
    canActivate: [authGuard]
  },
  { 
    path: 'cadastrar', 
    component: ExpenseForm,
    canActivate: [authGuard]
  },
  {
    path: 'cadastrar-topicos',
    component: TopicForm,
    canActivate: [authGuard]
  },
  {
    path: 'listar-topicos',
    component: TopicList,
    canActivate: [authGuard]
  },
  {
    path: 'cadastrar-tipos-pagamentos',
    component: TypePaymentForm,
    canActivate: [authGuard]
  },
  {
    path: 'listar-tipos-pagamentos',
    component: TypePaymentsList,
    canActivate: [authGuard]
  },
  {
    path: 'cadastrar-rendas',
    component: IncomesForm,
    canActivate: [authGuard]
  },
  {
    path: 'listar-rendas',
    component: IncomesList,
    canActivate: [authGuard]
  },
];