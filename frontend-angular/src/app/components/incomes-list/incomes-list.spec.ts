import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomesList } from './incomes-list';

describe('IncomesList', () => {
  let component: IncomesList;
  let fixture: ComponentFixture<IncomesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomesList],
    }).compileComponents();

    fixture = TestBed.createComponent(IncomesList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
