import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AdminService } from '../../services/admin/admin.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-member-dialog',
  templateUrl: './add-member-dialog.component.html',
  styleUrls: ['./add-member-dialog.component.scss']
})
export class AddMemberDialogComponent {
  memberForm: FormGroup;
  userTypes: string[] = ['admin', 'user', 'faculty'];

  constructor(
    public dialogRef: MatDialogRef<AddMemberDialogComponent>,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.memberForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      userType: ['', Validators.required],
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onAddMemberClick(): void {
    if (this.memberForm.valid) {
      // Perform your action with this.memberForm.value
      this.dialogRef.close(this.memberForm.value);
    }
  }
}
