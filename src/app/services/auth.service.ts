import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private baseUrl = environment.baseUrl;
  private view_data = new Subject<string>();
  view_data$ = this.view_data.asObservable();
  token: any;

  viewData(data: string) {
    this.view_data.next(data);
  }

  constructor(private http: HttpClient) {}

  public headerWithToken(): HttpHeaders {
    const userData = localStorage.getItem("userData");
    const token = userData ? JSON.parse(userData).token : null;
    console.log(token);

    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token + "",
    });
  }

  // API call for email and mobile number registration
  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/vendor/register`, data);
  }

  // API call for OTP verification
  verifyOTP(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/vendor/verify-otp`, data);
  }

  // API call for business details update
  businessDetails(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/vendor/update`, data, {
      headers: this.headerWithToken(),
    });
  }

  getAllCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/category/all`, {
      headers: this.headerWithToken(),
    });
  }

  // easeBuzz
  initiateEaseBuzzPay(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/vendor/easebuzz-initiate`, data, {
      headers: this.headerWithToken(),
    });
  }

  //RazorPay
  initiateRazorPay(amount: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/vendor/razorpay-initiate`,
      { amount },
      {
        headers: this.headerWithToken(),
      }
    );
  }

  savePaymentDetails(paymentDetails: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/vendor/razorpay-response`,
      paymentDetails,
      {
        headers: this.headerWithToken(),
      }
    );
  }

  savePaymentDetailsEaseBuzz(paymentDetails: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/vendor/easebuzz-response`,
      paymentDetails,
      {
        headers: this.headerWithToken(),
      }
    );
  }

  isAuthenticated(): boolean {
    const userData = localStorage.getItem("userData");
    const token = userData ? JSON.parse(userData).token : null;
    return token !== null;
  }

  // PayU API
  initiatePayUPayment(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/payu/payu-initiate`, data, {
      headers: this.headerWithToken(),
    });
  }

  // Terms and conditions
  getTermsAndConditions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/policy/terms_and_conditions`, {
      headers: this.headerWithToken(),
    });
  }

  // Verify GST
  verifyGstNumber(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/vendor/verify-gst`, data, {
      headers: this.headerWithToken(),
    });
  }
}
