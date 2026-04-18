import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-student-dialog',
  standalone: false,
  templateUrl: './student-dialog.html',
  styleUrl: './student-dialog.css',
})
export class StudentDialog {
  public userForm: any;

  constructor(
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<StudentDialog>,
  ) {
    this.userForm = this.formBuilder.group({
      first_name: [''],
      last_name: [''],
      email: [''],
      phone: [''],
      address: [''],
      password: [''],
      user_type: [1], // 1 represents 'student'
    });
  }

  saveStudent() {
    // Logic to save student details
    this.dialogRef.close(this.userForm.value);
  }
}
