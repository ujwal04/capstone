// admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.getUserType() === 'admin') {
      return true; // Allow access for admin
    } else {
      this.router.navigate(['/home']); // Redirect to home if not an admin
      return false;
    }
  }
}
