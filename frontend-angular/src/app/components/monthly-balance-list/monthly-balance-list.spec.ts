import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyBalanceList } from './monthly-balance-list';

describe('MonthlyBalanceList', () => {
  let component: MonthlyBalanceList;
  let fixture: ComponentFixture<MonthlyBalanceList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyBalanceList],
    }).compileComponents();

    fixture = TestBed.createComponent(MonthlyBalanceList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
