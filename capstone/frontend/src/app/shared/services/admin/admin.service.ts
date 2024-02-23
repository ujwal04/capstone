import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) { }

  getAllMembers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/members`);
  }

  addMember(member: any): Observable<any> {
    // Include userType in the request body
    return this.http.post(`${environment.apiUrl}/admin/member`, { ...member });
  }

  deleteMember(email: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/admin/members/${email}`);
  }
}
