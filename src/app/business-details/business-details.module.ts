import { BusinessDetailsComponent } from './business-details.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const businessDetails: Routes=[{path: '', component: BusinessDetailsComponent}]

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(businessDetails)
  ]
})
export class BusinessDetailsModule { }
