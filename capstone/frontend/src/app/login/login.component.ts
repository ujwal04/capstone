import { Component, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
type userCreds = { email: string, password?: string, userType: string };

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})

export class LoginComponent {
  form: FormGroup;
  public loginInvalid: boolean;
  private formSubmitAttempt: boolean;
  private returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/home';

    this.form = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;

    if (this.form.valid) {
      try {
        const email = this.form.get('email').value;
        const password = this.form.get('password').value;

        this.authService.login(email, password).subscribe(
          (res) => {
            if (res.success) {
              this.router.navigate(['/home']);
            } else {
              // Handle unsuccessful login
              this.loginInvalid = true;
            }
          },
          (error) => {
            // Handle login error (e.g., network issues)
            console.error('Login error:', error);
            this.loginInvalid = true;
          }
        );
      } catch (err) {
        // Handle other errors
        console.error('Unexpected error during login:', err);
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }


}
