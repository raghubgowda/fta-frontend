import { FeatureService } from '../services/feature.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Feature, User } from '../models';
import { AlertService, AuthenticationService } from '../services';
import { FormGroup } from '@angular/forms';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: './feature-detail.component.html'
})
export class FeatureDetailComponent implements OnInit {
  pageTitle: string = 'Feature Details';
  featureFormGroup: FormGroup;
  feature: Feature;
  loggedInUser: User;
  error: any = { isError: false, errorMessage: '' };

  constructor(
    private formBuilder: RxFormBuilder,
    private activatedRoute: ActivatedRoute,
    private featureService: FeatureService,
    private router: Router,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private datePipe: DatePipe) {
    this.authenticationService.currentUser.subscribe(user => this.loggedInUser = user);
  };

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.featureService.getFeatureDetails(id).subscribe({
        next: feature => {
          this.pageTitle = `Edit ${this.pageTitle}`;
          feature.modifiedBy = this.loggedInUser.email;
          feature.modifiedOn = new Date;
          this.featureFormGroup = this.formBuilder.formGroup(Feature, feature);
        },
        error: err => this.alertService.error(err)
      });
    }
    else {
      this.pageTitle = `Add ${this.pageTitle}`;
      let feature = new Feature();
      feature.createdBy = this.loggedInUser.email;
      this.featureFormGroup = this.formBuilder.formGroup(Feature, feature);
    }
  }

  onBack(): void {
    this.router.navigate(['']);
  }

  onSubmit() {
    let updateFeatue = new Feature(this.featureFormGroup.value);

    if (this.datePipe.transform(updateFeatue.expiresOn, "dd-MM-yyyy") <= this.datePipe.transform(new Date, "dd-MM-yyyy")) {
      this.error = { isError: true, errorMessage: 'Expiry date must be a future date' };
      return;
    }
    
    this.featureService.updateFeature(updateFeatue)
      .pipe()
      .subscribe(
        data => {
          this.alertService.success('Feature saved successfully', true);
          this.router.navigate(['']);
        },
        error => {
          this.alertService.error(error);
        });
  }

}
