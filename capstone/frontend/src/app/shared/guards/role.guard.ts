// role-auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const expectedRole = next.data.expectedRole;

    if (this.authService.getUserType() === expectedRole) {
      return true;
    } else {
      // Redirect to unauthorized page or handle unauthorized access
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}
