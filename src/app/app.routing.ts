import { FeatureDetailComponent } from './features/feature-detail.component';
import { Routes, RouterModule } from '@angular/router';

import { FeaturesComponent } from './features';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './helpers';
import { RoleGaurd } from './helpers/role.guard';

const routes: Routes = [
    { path: '', component: FeaturesComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'editFeature/:id', component: FeatureDetailComponent, canActivate: [RoleGaurd] },
    { path: 'addFeature', component: FeatureDetailComponent, canActivate: [RoleGaurd] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);