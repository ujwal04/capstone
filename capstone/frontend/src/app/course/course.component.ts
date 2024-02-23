import { Component } from '@angular/core';
import { CourseService } from '../shared/services/course/course.service';
import { Course } from '../shared/models/course.model';
import { AuthService } from '../shared/services/auth/auth.service';
import { UpdateCourseDialogComponent } from '../shared/models/update-course-dialog/update-course-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent {
  courses: Course[] = [];
  accessChecker: any
  constructor(private courseService: CourseService, private authService: AuthService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCourses();
    this.courseService.getAccessRequests().subscribe((res) => {
      this.accessChecker = res
    })
  }

  getCourses(): void {
    this.courseService.getCourses().subscribe((courses) => {
      this.courses = courses;
    });
  }


  requestAccess(course: Course): void {
    this.courseService.requestAccess(this.authService.getUser().userId, course._id).subscribe((response) => {
      if (response.success) {
        // Request sent successfully
        alert(`Request for ${course.title} sent successfully.`);
      } else {
        // Request failed, handle error
        alert(`Request for ${course.title} failed: ${response.message}`);
      }
    });
  }

  // Add this method in your CourseComponent class
  isAccessGranted(courseId: string): boolean {
    const userId = this.authService.getUser()?.userId; // Use optional chaining to avoid errors if getUser() returns null
    const accessChecker = this.accessChecker || []; // Use an empty array if accessChecker is undefined

    // Check if there is an access request for the current user and course
    const accessRequest = accessChecker.find(request => request.userId?._id === userId && request.courseId?._id === courseId);

    // If an access request exists and is granted, return true
    return accessRequest && accessRequest.granted;
  }




  addCourse(): void {
    const newCourse: Course = {
      _id: '',
      title: 'New Course',
      description: 'Description for the new course',
      isAccessGranted: false,
      image: 'Image URL'
    };

    this.courseService.addCourse(newCourse).subscribe((addedCourse) => {
      this.courses.push(addedCourse);
    });
  }

  openUpdateDialog(course: Course): void {
    // Only open the dialog if the user is an admin or faculty
    if (this.isAdmin() || this.isFaculty()) {
      const dialogRef = this.dialog.open(UpdateCourseDialogComponent, {
        width: '400px',
        data: course
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.updateCourse(result)
        }
      });
    }
  }

  updateCourse(course: Course): void {
    this.courseService.updateCourse(course._id, course).subscribe((result) => {
      this.getCourses()
    });
  }

  deleteCourse(course: Course): void {
    this.courseService.deleteCourse(course._id).subscribe(() => {
      this.courses = this.courses.filter(c => c._id !== course._id);
    });
  }

  isAdmin(): boolean {
    const user = this.authService.getUser();
    return user && user.userType === 'admin'
  }

  isFaculty(): boolean {
    const user = this.authService.getUser();
    return user && user.userType === 'faculty';
  }

  isUser(): boolean {
    const user = this.authService.getUser();
    return user && user.userType === 'user';
  }
}
