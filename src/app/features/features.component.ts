import { Component, OnInit } from '@angular/core';
import { Role } from '../models';
import { FeatureService, AuthenticationService, AlertService } from '../services';
import { Router } from '@angular/router';

@Component({ templateUrl: 'features.component.html' })
export class FeaturesComponent implements OnInit {
    features = [];
    canEdit: boolean = false;
    constructor(
        private authenticationService: AuthenticationService,
        private featureService: FeatureService,
        private router: Router,
        private alertService: AlertService
    ) {
        this.canEdit = this.authenticationService.currentUserValue.role == Role.ProductOwner;
    }

    ngOnInit() {
        this.loadAllFeatures();
    }

    private loadAllFeatures() {
        this.featureService.getAllFeature()
            .pipe()
            .subscribe(features => this.features = features);
    }

    addFeature() {
        this.router.navigate(['/addFeature']);
    }

    editFeature(id: string): void {
        this.router.navigate(['/editFeature', id]);
    }

    deleteFeature(id: string): void {
        this.featureService.deleteFeature(id)
            .pipe()
            .subscribe(
                data => {
                    this.alertService.success('Feature deleted successfully', true);
                    this.loadAllFeatures();
                },
                error => {
                    this.alertService.error(error);
                });
    }
}