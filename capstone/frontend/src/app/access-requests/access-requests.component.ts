import { Component } from '@angular/core';
import { CourseService } from '../shared/services/course/course.service';

@Component({
  selector: 'app-access-requests',
  templateUrl: './access-requests.component.html',
  styleUrls: ['./access-requests.component.scss']
})
export class AccessRequestsComponent {
  accessRequests: any[] = [];

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.getAccessRequests();
  }

  getAccessRequests(): void {
    this.courseService.getAccessRequests().subscribe((requests) => {
      this.accessRequests = requests;
    });
  }

  grantAccess(requestId: string): void {
    this.courseService.grantAccess(requestId).subscribe((response) => {
      if (response.success) {
        // Access granted successfully
        alert('Access granted successfully.');
        this.getAccessRequests(); // Refresh access requests after granting access
      } else {
        // Access grant failed, handle error
        alert(`Access grant failed: ${response.message}`);
      }
    });
  }
}
