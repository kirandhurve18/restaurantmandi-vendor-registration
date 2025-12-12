import { Component, HostListener } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-business-details",
  templateUrl: "./business-details.component.html",
  styleUrls: ["./business-details.component.css"],
})
export class BusinessDetailsComponent {
  businessForm: any;
  userData: any;
  categoriesList: any[] = [];
  data: any;
  isGstVerified: boolean = false;
  isGstVerifiedLoading: boolean = false;
  selectedCategories: string[] = [];
  isCategoryDropdownOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem("userData") || "{}");
    this.loadForm();
    this.loadCategories();
  }

  loadCategories(): void {
    this.apiService.getAllCategories().subscribe(
      (response: any) => {
        this.categoriesList = response.data || [];
      },
      (error) => {
        console.error("Error loading categories:", error);
      }
    );
  }

  loadForm() {
    this.businessForm = this.fb.group({
      mobile: [
        this.userData.mobile,
        [Validators.required, Validators.pattern("^[0-9]{10}$")],
      ],
      hasGstin: ["true"],
      gstNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$"
          ),
        ],
      ],
      businessName: ["", [Validators.required]],
      website: [""],
      address: ["", [Validators.required]],
      businessNumber: [
        "",
        [Validators.required, Validators.pattern("^[0-9]{10}$")],
      ],
      categories: [[], [Validators.required]],
    });
  }

  onSubmit() {
    // Check if any required field is blank (except categories which has custom validation)
    const requiredFields = ["businessName", "address", "gstNumber"];

    const isAnyFieldBlank = requiredFields.some(
      (field) => this.businessForm.get(field)?.value === ""
    );

    if (isAnyFieldBlank) {
      this.toastr.error("Please fill in all required fields");
      return; // Stop further processing
    }

    // Validate business number format
    if (
      this.businessForm.value.businessNumber &&
      !this.isValidMobileNumber(this.businessForm.value.businessNumber)
    ) {
      this.toastr.error(
        "Business Number must be a valid 10-digit mobile number"
      );
      return;
    }

    // Validate GST number format
    if (
      this.businessForm.value.hasGstin === "true" &&
      this.businessForm.value.gstNumber &&
      !this.isValidGstNumber(this.businessForm.value.gstNumber)
    ) {
      this.toastr.error("Please enter a valid 15-character GST number");
      return;
    }

    //if hasGstin is true, then isGstVerified is true
    if (
      this.businessForm.value.hasGstin === "true" &&
      this.isGstVerified === false
    ) {
      this.toastr.error("Please verify GST Number");
      return;
    }

    // Check if at least one category is selected
    if (this.selectedCategories.length === 0) {
      this.toastr.error("Please select at least one category");
      return;
    }

    const data = {
      hasGstin: this.businessForm.value.hasGstin === "true",
      gstNumber: this.businessForm.value.gstNumber,
      isGstVerified: this.isGstVerified,
      mobile: this.businessForm.value.mobile,
      businessName: this.businessForm.value.businessName,
      website: this.businessForm.value.website,
      address: this.businessForm.value.address,
      businessNumber: this.businessForm.value.businessNumber,
      categories: this.selectedCategories.map((categoryId) => ({ categoryId })),
    };

    this.apiService.businessDetails(data).subscribe(
      (res) => {
        this.handleBusinessDetailsSuccess(res);
      },
      (error) => {
        this.handleBusinessDetailsError(error);
      }
    );
  }

  private handleBusinessDetailsSuccess(res: any) {
    this.data = res;
    if (this.data.success) {
      console.log("Business Details created successfully!", "dismiss");
      this.toastr.success("Business Details created successfully!");
      localStorage.setItem("businessDetails", JSON.stringify(res));
      this.router.navigate(["/payment"]);
    } else {
      console.log(this.data.message, "dismiss");
    }
  }
  verifyGstNumber() {
    //check gstNumber is not empty
    if (this.businessForm.value.gstNumber == "") {
      this.toastr.error("GST Number is required");
      return;
    }
    //check gstNumber is valid
    if (!this.isValidGstNumber(this.businessForm.value.gstNumber)) {
      this.toastr.error("Please enter a valid 15-character GST number");
      return;
    }
    const data = {
      gstNumber: this.businessForm.value.gstNumber,
    };
    this.isGstVerifiedLoading = true;
    this.apiService.verifyGstNumber(data).subscribe({
      next: (res: any) => {
        //check for error first
        if (res.data?.error) {
          this.toastr.error(res.data.error);
          this.isGstVerifiedLoading = false;
          return;
        }
        if (res.data?.details["COMPANY STATUS"] == "ACTIVE") {
          this.isGstVerified = true;
          const businessName = res.data?.details["LEGAL NAME OF BUSINESS"];
          console.log("Business Name from GST:", businessName);

          // Auto fill the businessName field
          this.businessForm.patchValue({
            businessName: businessName,
          });
          //auto fill the address field
          this.businessForm.patchValue({
            address: res.data?.details["PRINCIPAL PLACE OF BUSINESS"],
          });

          this.toastr.success(res.message);
        }
        console.log(res, this.isGstVerifiedLoading);
        this.isGstVerifiedLoading = false;
      },
      error: (error) => {
        console.log(error);
        const errorMessage = "Failed to verify GST Number";
        this.toastr.error(errorMessage);
        this.isGstVerifiedLoading = false;
      },
    });
  }
  generateTemporaryGstNumber() {
    window.open("https://reg.gst.gov.in/registration/generateuid", "_blank");
  }

  private handleBusinessDetailsError(error: any) {
    console.error("Error during business details submission:", error);
    // Provide appropriate feedback to the user or handle the error as needed
  }

  isFieldInvalid(field: string) {
    if (field === "categories") {
      return (
        this.selectedCategories.length === 0 &&
        this.businessForm.get(field)?.touched
      );
    }
    return (
      this.businessForm.get(field)?.invalid &&
      this.businessForm.get(field)?.touched
    );
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Handle category checkbox change
  onCategoryChange(event: any, categoryId: string) {
    if (event.target.checked) {
      // Add category if not already selected
      if (!this.selectedCategories.includes(categoryId)) {
        this.selectedCategories.push(categoryId);
      }
    } else {
      // Remove category from selection
      this.selectedCategories = this.selectedCategories.filter(
        (id) => id !== categoryId
      );
    }

    // Update form control value
    this.businessForm.patchValue({
      categories: this.selectedCategories,
    });
  }

  // Check if category is selected
  isCategorySelected(categoryId: string): boolean {
    return this.selectedCategories.includes(categoryId);
  }

  // Get selected categories text for display
  getSelectedCategoriesText(): string {
    if (this.selectedCategories.length === 0) {
      return "None";
    }

    const selectedCategoryNames = this.selectedCategories.map((categoryId) => {
      const category = this.categoriesList.find(
        (cat) => cat._id === categoryId
      );
      return category ? category.categoryName : categoryId;
    });

    return selectedCategoryNames.join(", ");
  }

  // Get category name by ID
  getCategoryName(categoryId: string): string {
    const category = this.categoriesList.find((cat) => cat._id === categoryId);
    return category ? category.categoryName : categoryId;
  }

  // Remove category from selection
  removeCategory(categoryId: string) {
    this.selectedCategories = this.selectedCategories.filter(
      (id) => id !== categoryId
    );

    // Update form control value
    this.businessForm.patchValue({
      categories: this.selectedCategories,
    });
  }

  // TrackBy function for ngFor performance
  trackByCategoryId(index: number, categoryId: string): string {
    return categoryId;
  }

  // Validate mobile number format
  isValidMobileNumber(mobile: string): boolean {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  }

  // Validate GST number format
  isValidGstNumber(gstNumber: string): boolean {
    if (!gstNumber) return false;
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    return gstRegex.test(gstNumber.toUpperCase());
  }

  // Handle GST number input - convert to uppercase
  onGstNumberInput(event: any) {
    const value = event.target.value.toUpperCase();
    this.businessForm.patchValue({
      gstNumber: value,
    });
  }

  // Toggle category dropdown
  toggleCategoryDropdown() {
    this.isCategoryDropdownOpen = !this.isCategoryDropdownOpen;
  }

  // Close dropdown when clicking outside
  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest(".position-relative");

    if (!clickedInside && this.isCategoryDropdownOpen) {
      this.isCategoryDropdownOpen = false;
    }
  }
}
