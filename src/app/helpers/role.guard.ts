import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services';
import { Role } from '../models';


@Injectable({ providedIn: 'root' })
export class RoleGaurd implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {}

    canActivate() {
        const currentUser = this.authenticationService.currentUserValue;
        if(!currentUser){
            this.router.navigate(['/login']);
        }
        if(currentUser && currentUser.role === Role.ProductOwner){
            // not logged in so redirect to login page with the return url
            return true;
        }
        else{
            this.router.navigate(['']);
        }
    }
}