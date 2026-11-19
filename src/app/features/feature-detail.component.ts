import { FeatureService } from '../services/feature.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Feature, User } from '../models';
import { AlertService, AuthenticationService } from '../services';
import { FormGroup } from '@angular/forms';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';

@Component({
  templateUrl: './feature-detail.component.html'
})
export class FeatureDetailComponent implements OnInit {
  pageTitle: string = 'Feature Details';
  featureFormGroup: FormGroup;
  feature: Feature;
  loggedInUser: User;
  featureId: string | null = null;
  error: any = { isError: false, errorMessage: '' };

  constructor(
    private formBuilder: RxFormBuilder,
    private activatedRoute: ActivatedRoute,
    private featureService: FeatureService,
    private router: Router,
    private alertService: AlertService,
    private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(user => this.loggedInUser = user);
  };

  ngOnInit() {
    this.featureId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.featureId) {
      this.featureService.getFeatureDetails(this.featureId).subscribe({
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
    const feature = new Feature(this.featureFormGroup.value);

    if (!this.isFutureDate(feature.expiresOn)) {
      this.error = { isError: true, errorMessage: 'Expiry date must be a future date' };
      return;
    }
    this.error = { isError: false, errorMessage: '' };

    const request = this.featureId
      ? this.featureService.updateFeature(feature)
      : this.featureService.addFeature(feature);

    request.subscribe(
      data => {
        this.alertService.success('Feature saved successfully', true);
        this.router.navigate(['']);
      },
      error => {
        this.alertService.error(error);
      });
  }

  // compares calendar days, so a date today is not treated as in the future
  private isFutureDate(date: Date | string): boolean {
    const expiry = new Date(date);
    expiry.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return expiry > today;
  }

}
