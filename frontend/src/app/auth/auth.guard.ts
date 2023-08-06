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

export const canActivateRoute: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    return inject(AuthGuard).canActivate(route, state);
};
