import { PaymentComponent } from './payment.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const payment: Routes=[{path: '', component: PaymentComponent}]

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(payment)
  ]
})
export class PaymentModule { }
