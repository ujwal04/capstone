import { Component } from '@angular/core';
import { AdminService } from '../shared/services/admin/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { AddMemberDialogComponent } from '../shared/components/add-member-dialog/add-member-dialog.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  members: any[];
  displayedColumns: string[] = ['email', 'userType', 'action'];
  dataSource = new MatTableDataSource<any>();

  constructor(private adminService: AdminService, private dialog: MatDialog) {

  }
  ngOnInit() {
    this.loadMembers()
  }

  loadMembers(): void {
    // Assuming you have fetched members from your service
    this.adminService.getAllMembers().subscribe((members) => {
      this.dataSource.data = members;
    });

  }

  openAddMemberDialog(): void {
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      width: '400px', 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addMember(result);
      }
    });
  }

  addMember(member) {
    this.adminService.addMember(member).subscribe((members) => {
      this.members = members;
      this.loadMembers();
    });
  }

  deleteMember(email: string): void {
    this.adminService.deleteMember(email).subscribe(() => {
      this.loadMembers();
    });
  }
}
