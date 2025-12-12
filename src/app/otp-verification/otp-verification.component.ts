// otp-verification.component.ts

import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-otp-verification",
  templateUrl: "./otp-verification.component.html",
  styleUrls: ["./otp-verification.component.css"],
})
export class OtpVerificationComponent implements OnInit {
  otpVerification: any;
  data: any;
  email: any;
  mobile: any;
  userData: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userData = this.getUserDataFromLocalStorage();

    if (!this.userData) {
      this.router.navigate(["/"]);
      return;
    }

    this.email = this.userData.email;
    this.mobile = this.userData.mobile;

    this.loadForm();
  }

  loadForm() {
    this.otpVerification = this.fb.group({
      email: [
        { value: this.email, disabled: true },
        [Validators.required, Validators.email],
      ],
      mobile: [
        { value: this.mobile, disabled: true },
        [Validators.required, Validators.pattern("^[0-9]{10}$")],
      ],
      otp: ["", [Validators.required]],
      termsConditions: [false, [Validators.requiredTrue]],
    });
  }

  onSubmit() {
    // Get raw values from disabled form controls
    const rawValue = this.otpVerification.getRawValue();

    let verificationObject: any = {
      mobile: parseInt(rawValue.mobile),
      otp: parseInt(rawValue.otp),
    };

    this.authService.verifyOTP(verificationObject).subscribe(
      (res) => {
        this.handleVerificationSuccess(res);
      },
      (error) => {
        this.handleVerificationError(error);
      }
    );
  }

  private handleVerificationSuccess(res: any) {
    this.data = res;
    localStorage.setItem("token", res.token);
    localStorage.setItem("id", res._id);

    if (this.data.success) {
      this.toastr.success("OTP verification successful");
      this.router.navigate(["/business-details"]);
    } else {
      this.toastr.error("OTP verification failed");
    }
  }

  private handleVerificationError(error: any) {
    console.error("Error during OTP verification:", error);
    this.toastr.error(error.error.message || "Please enter the correct otp");
  }

  private getUserDataFromLocalStorage() {
    const useData: any = localStorage.getItem("userData");
    return useData ? JSON.parse(useData) : null;
  }

  openTermsAndConditions() {
    const url = window.location.origin + "/terms-and-conditions";
    window.open(url, "_blank");
  }
}
