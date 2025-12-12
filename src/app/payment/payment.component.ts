// import { AuthService } from './../services/auth.service';
// import { Component } from '@angular/core';
// import { Router } from '@angular/router';

// declare var EasebuzzCheckout: any;
// declare var Razorpay: any;

// interface RazorpayResponse {
//   razorpayPaymentId: string;
//   razorpayOrderId: string;
//   razorpaySignature: string;
// }

// @Component({
//   selector: 'app-payment',
//   templateUrl: './payment.component.html',
//   styleUrls: ['./payment.component.css'],
// })
// export class PaymentComponent {
//   selectedPaymentMethod: string = '';
//   name: any;
//   phone: any;
//   email: any;
//   id: any;
//   plan: any;

//   constructor(private router: Router, private PaymentService: AuthService) {}

//   ngOnInit(): void {
//     const userData: any = localStorage.getItem('businessDetails');
//     const verify: any = JSON.parse(userData);
//     this.name = verify.data.name;
//     this.phone = verify.data.mobile;
//     this.email = verify.data.email;
//     this.id = verify.data._id;
//     console.log(this.name);
//     console.log(this.phone);
//     console.log(this.email);
//     console.log(verify);
//   }

//   selectPaymentMethod(paymentMethod: string): void {
//     this.selectedPaymentMethod = paymentMethod;
//   }

//   initiatePayment() {
//     if (this.selectedPaymentMethod === 'easebuzz') {
//       this.initiateEasebuzzPayment();
//     } else if (this.selectedPaymentMethod === 'razerpay') {
//       this.initiateRazorpayPayment();
//     } else {
//       alert('Please select a payment method first');
//       console.error('Invalid payment method selected.');
//     }
//   }

//   initiateEasebuzzPayment() {
//     let data = {
//       amount: 1,
//       name: this.name,
//       mobile: this.phone,
//       email: this.email,
//     };

//     try {
//       this.PaymentService.initiateEaseBuzzPay(data).subscribe((res: any) => {
//         console.log(res);

//         setTimeout(() => {
//           const options2 = {
//             access_key: res.data,
//             onResponse: (response: any) => {
//               console.log(response);
//               if (response) {
//                 console.log(response);
//                 this.handleEasebuzzResponse(response);
//               }
//             },
//             theme: '#9abd3c', // Replace with your desired theme color
//           };
//           const easebuzzCheckout = new EasebuzzCheckout(res.data, 'test'); // Replace 'prod' with 'test' for the test environment
//           easebuzzCheckout.initiatePayment(options2);
//         }, 900);
//       });
//     } catch (error: any) {
//       console.error('Easebuzz initiation failed:', error);

//       alert('Easebuzz initiation failed. Please try again.');

//       // Log additional information for debugging
//       if (error && error.error) {
//         console.log('Easebuzz Backend Error Response:', error.error);
//       }

//       if (error && error.headers) {
//         console.log('Easebuzz Backend Error Headers:', error.headers);
//       }
//     }
//   }

//   initiateRazorpayPayment() {
//     let amount = 2500;
//     // / let user_id = this.id;

//     this.PaymentService.initiateRazorPay(amount).subscribe((res: any) => {
//       console.log(res);
//       this.payWithRazorpay(res.data.id);
//     });
//   }

//   payWithRazorpay(orderId: string) {
//     const options: any = {
//       key: 'rzp_test_aij6eAHc0nlTbg',
//       amount: 100,
//       currency: 'INR',
//       name: 'Your Company Name',
//       order_id: orderId,
//       // ... other options ...
//     };

//     options.handler = (response: any, error: any) => {
//       options.response = response;
//       console.log(options);
//       console.log(error);
//       // Handle success or failure as needed
//       if (response) {
//         console.log('Razorpay payment successful:', response);
//         alert('Razorpay payment successful');
//         const razorpayResponse: RazorpayResponse = {
//           razorpayPaymentId: response.razorpay_payment_id,
//           razorpayOrderId: response.razorpay_order_id,
//           razorpaySignature: response.razorpay_signature,
//         };
//         this.handlePaymentSuccess(response, options);
//       } else {
//         console.log('Razorpay payment failed:', response);
//         alert('Razorpay payment failed');
//         this.handlePaymentFailure(response);
//       }
//     };

//     // Initialize the 'modal' property if it is not already defined
//     options.modal = options.modal || {};

//     options.modal.ondismiss = () => {
//       console.log('Razorpay transaction cancelled.');
//       alert('Razorpay transaction cancelled.');
//     };

//     const rzp = new Razorpay(options);
//     rzp.open();
//   }

//   handleEasebuzzResponse(response: any) {
//     if (response.status === 'success') {
//       console.log('Easebuzz payment successful:', response);
//       this.handlePaymentSuccessEasebuzz(response);
//     } else {
//       console.log('Easebuzz payment failed:', response);
//       this.handlePaymentFailure(response);
//     }
//   }

//   handlePaymentSuccessEasebuzz(response: any) {
//     // this.router.navigate(['/payment-success']);
//     console.log();
//     const paymentData2 = {
//       notes: {
//         userId: this.id,
//         response: JSON.stringify(response),
//       },
//       easeBuzzResponse: {
//         bankRefNumber: response.bank_ref_num,
//         easepayId: response.easepayid,
//         email:response.email,
//         hash:response.hash,
//         key:response.key,
//         status:response.status,
//         txnId:response.txnid,
//       },
//     };

//     // Call your AuthService method to save payment details
//     this.PaymentService.savePaymentDetailsEaseBuzz(paymentData2).subscribe(
//       (res: any) => {
//         console.log('Payment details saved successfully:', res);
//         this.router.navigate(['/payment-success']);
//       },
//       (error: any) => {
//         console.error('Failed to save payment details:', error);

//         // Log additional information for debugging
//         if (error && error.error) {
//           console.log('Backend Error Response:', error.error);
//         }

//         if (error && error.headers) {
//           console.log('Backend Error Headers:', error.headers);
//         }
//       }
//     );
//   }

//   handlePaymentSuccess(response: any, options: any) {
//     const paymentData = {
//       notes: {
//         userId: this.id,
//         // plan: this.plan,
//         response: JSON.stringify(options),
//       },
//       razorpayResponse: {
//         razorpayPaymentId: response.razorpay_payment_id,
//         razorpayOrderId: response.razorpay_order_id,
//         razorpaySignature: response.razorpay_signature,
//       },
//     };

//     // Call your AuthService method to save payment details
//     this.PaymentService.savePaymentDetails(paymentData).subscribe(
//       (res: any) => {
//         console.log('Payment details saved successfully:', res);
//         this.router.navigate(['/payment-success']);
//       },
//       (error: any) => {
//         console.error('Failed to save payment details:', error);

//         // Log additional information for debugging
//         if (error && error.error) {
//           console.log('Backend Error Response:', error.error);
//         }

//         if (error && error.headers) {
//           console.log('Backend Error Headers:', error.headers);
//         }
//       }
//     );
//   }

//   handlePaymentFailure(response: any) {
//     console.error('Payment failed. Please try again.');
//     alert('Payment Failed. Please try again.');
//   }
// }

import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { ToastrService } from "ngx-toastr";

declare var EasebuzzCheckout: any;
declare var Razorpay: any;

interface RazorpayResponse {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.css"],
})
export class PaymentComponent {
  selectedPaymentMethod: string = "";
  name: any;
  phone: any;
  email: any;
  id: any;
  plan: any;
  showDetails: boolean = false;

  constructor(
    private router: Router,
    private PaymentService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const userData: any = localStorage.getItem("businessDetails");
    const verify: any = JSON.parse(userData);
    this.name = verify.data.businessDetails.businessName;
    this.phone = verify.data.mobile;
    this.email = verify.data.email;
    this.id = verify.data._id;
  }

  selectPaymentMethod(paymentMethod: string): void {
    this.selectedPaymentMethod = paymentMethod;
  }

  initiatePayment() {
    this.initiatePayUPayment();
  }
  initiatePayUPayment() {
    const data = {
      amount: 11798.82,
      firstname: this.name,
      phone: this.phone,
      email: this.email,
      vendorId: this.id,
    };

    this.PaymentService.initiatePayUPayment(data).subscribe({
      next: (result: any) => {
        console.log("PayU Init Result:", result);

        if (!result.paymentUrl || !result.formData) {
          this.toastr.error("Invalid response from server. Please try again.");
          return;
        }

        const form = document.createElement("form");
        form.method = "POST";
        form.action = result.paymentUrl;

        Object.keys(result.formData).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = result.formData[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);

        // optional: wrap in setTimeout to ensure DOM update
        setTimeout(() => {
          form.submit();
        }, 0);
      },
      error: (err) => {
        console.error("PayU initiation failed:", err);
        this.toastr.error("Payment initiation failed. Please try again.");

        if (err?.error) {
          console.log("PayU Backend Error Response:", err.error);
        }
        if (err?.headers) {
          console.log("PayU Backend Error Headers:", err.headers);
        }
      },
    });
  }

  initiateEasebuzzPayment() {
    let data = {
      amount: 17700,
      name: this.name,
      mobile: this.phone,
      email: this.email,
    };

    try {
      this.PaymentService.initiateEaseBuzzPay(data).subscribe((res: any) => {
        console.log(res);

        setTimeout(() => {
          const options2 = {
            access_key: res.data,
            onResponse: (response: any) => {
              console.log(response);
              if (response) {
                console.log(response);
                this.handleEasebuzzResponse(response);
              }
            },
            theme: "#9abd3c", // Replace with your desired theme color
          };
          const easebuzzCheckout = new EasebuzzCheckout(res.data, "prod");
          easebuzzCheckout.initiatePayment(options2);
        }, 900);
      });
    } catch (error: any) {
      console.error("Easebuzz initiation failed:", error);
      this.toastr.error("Easebuzz initiation failed. Please try again.");

      // Log additional information for debugging
      if (error && error.error) {
        console.log("Easebuzz Backend Error Response:", error.error);
      }

      if (error && error.headers) {
        console.log("Easebuzz Backend Error Headers:", error.headers);
      }
    }
  }

  initiateRazorpayPayment() {
    let amount = 17700;

    this.PaymentService.initiateRazorPay(amount).subscribe((res: any) => {
      console.log(res);
      this.payWithRazorpay(res.data.id);
    });
  }

  payWithRazorpay(orderId: string) {
    const options: any = {
      key: "rzp_live_VWO17wrNuylfD9",
      // amount: 1,
      // currency: 'INR',
      name: "Restaurant Mandi",
      order_id: orderId,
    };

    options.handler = (response: any, error: any) => {
      options.response = response;
      console.log(options);
      console.log(error);

      if (response) {
        console.log("Razorpay payment successful:", response);
        this.toastr.success("Razorpay payment successful");

        const razorpayResponse: RazorpayResponse = {
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        this.handlePaymentSuccess(response, options);
      } else {
        console.log("Razorpay payment failed:", response);
        this.toastr.error("Razorpay payment failed");
        this.handlePaymentFailure(response);
      }
    };

    options.modal = options.modal || {};

    options.modal.ondismiss = () => {
      console.log("Razorpay transaction cancelled.");
      this.toastr.error("Razorpay transaction cancelled");
    };

    const rzp = new Razorpay(options);
    rzp.open();
  }

  handleEasebuzzResponse(response: any) {
    if (response.status === "success") {
      console.log("Easebuzz payment successful:", response);
      this.toastr.success("Easebuzz payment successful");

      this.handlePaymentSuccessEasebuzz(response);
    } else {
      console.log("Easebuzz payment failed:", response);
      this.toastr.error("Easebuzz payment failed");
      this.handlePaymentFailure(response);
    }
  }

  handlePaymentSuccessEasebuzz(response: any) {
    const paymentData2 = {
      notes: {
        userId: this.id,
        response: JSON.stringify(response),
      },
      easeBuzzResponse: {
        bankRefNumber: response.bank_ref_num,
        easepayId: response.easepayid,
        email: response.email,
        hash: response.hash,
        key: response.key,
        status: response.status,
        txnId: response.txnid,
      },
    };

    this.PaymentService.savePaymentDetailsEaseBuzz(paymentData2).subscribe(
      (res: any) => {
        console.log("Payment details saved successfully:", res);
        // this.showToast('Easebuzz payment successful', 'info');

        this.router.navigate(["/payment-success"]);
      },
      (error: any) => {
        console.error("Failed to save payment details:", error);

        if (error && error.error) {
          console.log("Backend Error Response:", error.error);
        }

        if (error && error.headers) {
          console.log("Backend Error Headers:", error.headers);
        }

        this.toastr.error("Failed to save payment details. Please try again.");
      }
    );
  }

  handlePaymentSuccess(response: any, options: any) {
    const paymentData = {
      notes: {
        userId: this.id,
        response: JSON.stringify(options),
      },
      razorpayResponse: {
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
      },
    };

    this.PaymentService.savePaymentDetails(paymentData).subscribe(
      (res: any) => {
        console.log("Payment details saved successfully:", res);
        this.router.navigate(["/payment-success"]);
      },
      (error: any) => {
        console.error("Failed to save payment details:", error);

        if (error && error.error) {
          console.log("Backend Error Response:", error.error);
        }

        if (error && error.headers) {
          console.log("Backend Error Headers:", error.headers);
        }

        this.toastr.error("Failed to save payment details. Please try again.");
      }
    );
  }

  handlePaymentFailure(response: any) {
    console.error("Payment failed. Please try again.");
    this.toastr.error("Payment Failed. Please try again.");
  }
}
