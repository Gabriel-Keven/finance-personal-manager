import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypePaymentForm } from './type-payment-form';

describe('TypePaymentForm', () => {
  let component: TypePaymentForm;
  let fixture: ComponentFixture<TypePaymentForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypePaymentForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TypePaymentForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
