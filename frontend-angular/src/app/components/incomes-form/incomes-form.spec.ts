import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomesForm } from './incomes-form';

describe('IncomesForm', () => {
  let component: IncomesForm;
  let fixture: ComponentFixture<IncomesForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomesForm],
    }).compileComponents();

    fixture = TestBed.createComponent(IncomesForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
