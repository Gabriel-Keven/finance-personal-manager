import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphsMonthlyBalance } from './graphs-monthly-balance';

describe('GraphsMonthlyBalance', () => {
  let component: GraphsMonthlyBalance;
  let fixture: ComponentFixture<GraphsMonthlyBalance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphsMonthlyBalance],
    }).compileComponents();

    fixture = TestBed.createComponent(GraphsMonthlyBalance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
