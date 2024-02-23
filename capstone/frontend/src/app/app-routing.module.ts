import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { CourseComponent } from './course/course.component';
import { FacultyComponent } from './faculty/faculty.component';
import { LearnerComponent } from './learner/learner.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { NonAuthGuard } from './shared/guards/non-auth.guard';
import { AdminGuard } from './shared/guards/admin.guard';
import { AccessRequestsComponent } from './access-requests/access-requests.component';
// import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login by default
  { path: 'login', component: LoginComponent,canActivate: [NonAuthGuard]},
  { path: 'register', component: RegisterComponent, canActivate: [NonAuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'courses', component: CourseComponent, canActivate: [AuthGuard] },
  { path: 'faculty', component: FacultyComponent },
  { path: 'learner', component: LearnerComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'access-requests', component: AccessRequestsComponent, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
