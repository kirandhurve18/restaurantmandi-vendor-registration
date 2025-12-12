import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-terms-and-conditions",
  templateUrl: "./terms-and-conditions.component.html",
  styleUrls: ["./terms-and-conditions.component.css"],
})
export class TermsAndConditionsComponent implements OnInit {
  termsAndConditions: string = "";
  loading: boolean = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadTermsAndConditions();
  }

  loadTermsAndConditions() {
    this.authService.getTermsAndConditions().subscribe(
      (res: any) => {
        console.log(res);
        if (res && res.data) {
          this.termsAndConditions = res.data.replace(/\r\n|\n|\r/g, "<br>");
          this.loading = false;
        }
      },
      (error) => {
        console.error("Error loading terms and conditions:", error);
        this.loading = false;
      }
    );
  }
}
