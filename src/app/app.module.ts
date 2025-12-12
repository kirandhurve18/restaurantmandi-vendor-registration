import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { VerificationComponent } from "./verification/verification.component";
import { BusinessDetailsComponent } from "./business-details/business-details.component";
import { PaymentComponent } from "./payment/payment.component";
import { PaymentDoneComponent } from "./payment-done/payment-done.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { OtpVerificationComponent } from "./otp-verification/otp-verification.component";
import { ToastComponent } from "./component/toast/toast.component";
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TermsAndConditionsComponent } from "./terms-and-conditions/terms-and-conditions.component";

@NgModule({
  declarations: [
    AppComponent,
    VerificationComponent,
    BusinessDetailsComponent,
    PaymentComponent,
    PaymentDoneComponent,
    OtpVerificationComponent,
    ToastComponent,
    TermsAndConditionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
