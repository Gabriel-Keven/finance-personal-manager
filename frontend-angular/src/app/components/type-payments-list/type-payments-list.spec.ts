import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypePaymentsList } from './type-payments-list';

describe('TypePaymentsList', () => {
  let component: TypePaymentsList;
  let fixture: ComponentFixture<TypePaymentsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypePaymentsList],
    }).compileComponents();

    fixture = TestBed.createComponent(TypePaymentsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
