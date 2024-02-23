import { Component, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class RegisterComponent {
  Roles: any = ['Admin', 'User', 'Faculty'];
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

        this.authService.register(email, password).subscribe(
          (res) => {
            if (res.success) {
              this.router.navigate(['/home']);
            }
          },
          (error) => {
            console.error('Registration error:', error);
          }
        );
      } catch (err) {
        // Handle other errors
        console.error('Unexpected error during registration:', err);
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }
}
