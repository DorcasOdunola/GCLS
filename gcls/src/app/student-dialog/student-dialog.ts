import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CenterService } from '../service/center-service';

@Component({
  selector: 'app-student-dialog',
  standalone: false,
  templateUrl: './student-dialog.html',
  styleUrl: './student-dialog.css',
})
export class StudentDialog {
  public userForm: any;
  public centersList: any[] = [];

  constructor(
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<StudentDialog>,
    public centerService: CenterService,
  ) {
    this.userForm = this.formBuilder.group({
      first_name: [''],
      last_name: [''],
      email: [''],
      phone: [''],
      address: [''],
      password: [''],
      center_id: [null],
      user_type: [1], // 1 represents 'student'
    });
  }

  ngOnInit() {
    this.getAllCenters();
  }

  getAllCenters() {
    this.centerService.getCenters().subscribe((response: any) => {
      console.log(response);
      if (response.status === 'success') {
        this.centersList = response.data;
      }
    });
  }
  saveStudent() {
    // Logic to save student details
    this.dialogRef.close(this.userForm.value);
  }
}
