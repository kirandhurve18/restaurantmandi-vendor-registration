import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PaymentDoneComponent } from './payment-done.component';

const paymentDone: Routes = [{ path: '', component: PaymentDoneComponent }];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(paymentDone)],
})
export class PaymentDoneModule {}
