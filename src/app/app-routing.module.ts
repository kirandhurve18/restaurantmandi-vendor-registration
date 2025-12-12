import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VerificationComponent } from "./verification/verification.component";
import { BusinessDetailsComponent } from "./business-details/business-details.component";
import { FormGroup, FormsModule } from "@angular/forms";
import { AuthGuardService } from "./services/auth-guard.service";
import { TermsAndConditionsComponent } from "./terms-and-conditions/terms-and-conditions.component";

const routes: Routes = [
  { path: "", component: VerificationComponent },
  { path: "terms-and-conditions", component: TermsAndConditionsComponent },

  // { path: '/business-details', component: BusinessDetailsComponent },

  {
    path: "business-details",
    loadChildren: () =>
      import("./business-details/business-details.module").then(
        (m) => m.BusinessDetailsModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: "otp-verification",
    loadChildren: () =>
      import("./otp-verification/otp-verification.module").then(
        (m) => m.OtpVerificationModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: "payment",
    loadChildren: () =>
      import("./payment/payment.module").then((m) => m.PaymentModule),
    canActivate: [AuthGuardService],
  },
  {
    path: "payment-success",
    loadChildren: () =>
      import("./payment-done/payment-done.module").then(
        (m) => m.PaymentDoneModule
      ),
    canActivate: [AuthGuardService],
  },
  {
    path: "payment-failure",
    loadChildren: () =>
      import("./payment-fail/payment-fail.module").then(
        (m) => m.PaymentFailModule
      ),
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
