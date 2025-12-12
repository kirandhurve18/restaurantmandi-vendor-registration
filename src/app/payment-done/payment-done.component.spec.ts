import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDoneComponent } from './payment-done.component';

describe('PaymentDoneComponent', () => {
  let component: PaymentDoneComponent;
  let fixture: ComponentFixture<PaymentDoneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentDoneComponent]
    });
    fixture = TestBed.createComponent(PaymentDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
