import { Component, inject, OnInit } from '@angular/core';

//Components
import { ExpenseForm } from "./components/exepense-form/expense-form";
import { ExpenseList } from './components/expense-list/expense-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ExpenseForm, ExpenseList],
  templateUrl: './app.html',
  styleUrl: './app.scss',

})
export class App {
}