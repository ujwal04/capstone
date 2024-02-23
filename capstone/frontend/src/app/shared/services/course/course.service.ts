import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../models/course.model';
import { environment } from 'src/app/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private http: HttpClient, private authService: AuthService) { }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${environment.apiUrl}/courses`);
  }

  addCourse(course: Course): Observable<Course> {
    const headers = this.createHeaders();
    return this.http.post<Course>(`${environment.apiUrl}/courses`, course, { headers });
  }

  updateCourse(courseId: string, updatedCourse: Course): Observable<Course> {
    const headers = this.createHeaders();
    return this.http.put<Course>(`${environment.apiUrl}/courses/${courseId}`, updatedCourse, { headers });
  }

  deleteCourse(courseId: string): Observable<void> {
    const headers = this.createHeaders();
    return this.http.delete<void>(`${environment.apiUrl}/courses/${courseId}`, { headers });
  }

  private createHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAccessRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/users/access-requests`);
  }

  requestAccess(userId: string, courseId: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/users/request-access`, { userId, courseId });
  }

  grantAccess(requestId: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/users/grant-access`, { requestId });
  }
}
