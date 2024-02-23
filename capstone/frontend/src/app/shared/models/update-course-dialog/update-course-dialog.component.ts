import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../update_course.model';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-update-course-dialog',
  templateUrl: './update-course-dialog.component.html',
  styleUrls: ['./update-course-dialog.component.scss']
})
export class UpdateCourseDialogComponent {
  updateForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UpdateCourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder
  ) {
    this.updateForm = this.formBuilder.group({
      title: data.title,
      description: data.description,
      image: data.image,
      _id: data._id
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onUpdate(): void {
    const updatedData = this.updateForm.value;
    this.dialogRef.close(updatedData);
  }
}
