import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { ToastrService } from "ngx-toastr";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-verification",
  templateUrl: "./verification.component.html",
  styleUrls: ["./verification.component.css"],
})
export class VerificationComponent implements OnInit {
  verificationForm: any;
  loading = false;
  data: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registrationService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadForm();
    // Simulate a delay to showcase the loading screen
    setTimeout(() => {
      this.loading = false; // Set loading to false when the delay is complete
    }, 1000); // Adjust the delay duration as needed
  }

  loadForm() {
    this.verificationForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      mobile: ["", [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      termsConditions: [false, [Validators.requiredTrue]],
    });
  }

  private handleRegistrationError(error: any) {
    console.error("Error during registration:", error);

    if (error instanceof HttpErrorResponse && error.status === 400) {
      const errorMessage = error.error?.message || "Bad Request";
      if (errorMessage.toLowerCase().includes("vendor already exists")) {
        this.toastr.error(
          "Vendor already exists. Please log in or use a different email/mobile."
        );
      } else {
        this.toastr.error(errorMessage);
      }
    } else {
      this.toastr.error("An error occurred. Please try again later.");
    }
  }

  onSubmit() {
    console.log(this.verificationForm.value);
    // this.submitted = true;
    if (this.loading) {
      return; // Do not submit the form if still loading
    }
    //check email and mobile is not empty
    if (
      this.verificationForm.value.email == "" ||
      this.verificationForm.value.mobile == ""
    ) {
      this.toastr.error("Please fill in all required fields");
      return;
    }
    //validate mobile number format
    if (
      this.verificationForm.value.mobile &&
      !this.isValidMobileNumber(this.verificationForm.value.mobile)
    ) {
      this.toastr.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (this.verificationForm.value.termsConditions == false) {
      this.toastr.error("Please accept the terms and conditions");
      return;
    }

    let registerObject: any = {
      email: this.verificationForm.value.email,
      mobile: this.verificationForm.value.mobile,
    };

    const formData = new FormData();
    formData.append("email", registerObject.email);
    formData.append("mobile", registerObject.mobile);

    this.registrationService.registerUser(formData).subscribe(
      (res) => {
        this.data = res;
        this.registrationService.viewData(res);
        const response2 = JSON.stringify(res);
        localStorage.setItem("userData", response2);

        console.log(this.data);
        if (this.data.success == true) {
          console.log("otp has been sent");
          this.toastr.success("OTP has been sent to your mobile number");
          this.router.navigate(["/otp-verification"]);
        } else {
          console.log("there is some error");
        }
        console.log(this.data);
      },
      (error) => {
        this.handleRegistrationError(error);
      }
    );
  }

  openTermsAndConditions() {
    const url = window.location.origin + "/register/terms-and-conditions";
    console.log(url);
    window.open(url, "_blank");
  }
  isValidMobileNumber(mobile: string): boolean {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  }
}
