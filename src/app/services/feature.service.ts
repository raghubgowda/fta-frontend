import { Feature } from './../models/feature';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FeatureService {
    apiUrl: string = 'http://localhost:8080/api/v1/features';
    constructor(private http: HttpClient) { }

    getAllFeature() {
        return this.http.get<Feature[]>(`${this.apiUrl}`);
    }

    getFeatureDetails(featureId: string) {
        return this.http.get<Feature>(`${this.apiUrl}/${featureId}`);
    }

    addFeature(feature: Feature) {
        return this.http.post(`${this.apiUrl}`, feature);
    }

    updateFeature(feature: Feature) {
        return this.http.put(`${this.apiUrl}`, feature);
    }

    deleteFeature(id: string) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
