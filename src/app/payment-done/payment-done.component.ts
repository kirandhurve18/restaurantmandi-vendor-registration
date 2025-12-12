import { Component } from "@angular/core";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-payment-done",
  templateUrl: "./payment-done.component.html",
  styleUrls: ["./payment-done.component.css"],
})
export class PaymentDoneComponent {
  login() {
    window.location.href = environment.dashboardUrl;
  }
}
