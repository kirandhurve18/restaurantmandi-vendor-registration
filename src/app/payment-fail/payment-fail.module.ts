import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { PaymentFailComponent } from "./payment-fail.component";

const paymentFail: Routes = [{ path: "", component: PaymentFailComponent }];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(paymentFail)],
})
export class PaymentFailModule {}
