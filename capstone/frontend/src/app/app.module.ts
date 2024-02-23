import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CourseComponent } from './course/course.component';
import { FacultyComponent } from './faculty/faculty.component';
import { LearnerComponent } from './learner/learner.component';
import { AdminComponent } from './admin/admin.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from './angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AddMemberDialogComponent } from './shared/components/add-member-dialog/add-member-dialog.component';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { UpdateCourseDialogComponent } from './shared/models/update-course-dialog/update-course-dialog.component';
import { AccessRequestsComponent } from './access-requests/access-requests.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CourseComponent,
    FacultyComponent,
    LearnerComponent,
    AdminComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    AddMemberDialogComponent,
    UpdateCourseDialogComponent,
    AccessRequestsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
