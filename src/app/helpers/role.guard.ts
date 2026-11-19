import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthenticationService } from '../services';
import { Role } from '../models';


@Injectable({ providedIn: 'root' })
export class RoleGaurd implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
        const currentUser = this.authenticationService.currentUserValue;
        if (!currentUser) {
            return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
        }
        if (currentUser.role === Role.ProductOwner) {
            return true;
        }
        return this.router.createUrlTree(['']);
    }
}