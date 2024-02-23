import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isLoggedIn: boolean;

  constructor(public authService: AuthService, private router: Router) {
    // Initialize isLoggedIn based on the current authentication status
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  navigate() {
    this.router.navigate(['/home'])
  }

  logout(): void {
    this.authService.logout();
  }
}
