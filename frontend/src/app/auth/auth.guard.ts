import { Injectable, inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";

@Injectable()
export class AuthGuard {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.authService.isAuthenticated()) {
            return true;
        } else {
            this.router.navigate(['/login'], {
                queryParams: {
                    return: state.url
                }
            });
        }

        return false;
    }
}

@Injectable()
export class NonAuthGuard {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.authService.isAuthenticated()) {
            return false;
        }

        return true;
    }
}

export const canActivateAuthRoute: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    return inject(AuthGuard).canActivate(route, state);
};

export const canActivateNoAuthRoute: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    return inject(NonAuthGuard).canActivate(route, state);
};
