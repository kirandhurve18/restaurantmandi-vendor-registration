import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OtpVerificationComponent } from './otp-verification.component';

const otpVerification: Routes=[{path: '', component: OtpVerificationComponent}]

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(otpVerification)
  ]
})
export class OtpVerificationModule { }
