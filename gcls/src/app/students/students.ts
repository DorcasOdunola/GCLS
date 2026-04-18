import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StudentService } from '../service/student-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StudentDialog } from '../student-dialog/student-dialog';

@Component({
  selector: 'app-students',
  standalone: false,
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class Students {
  public studentsArray: any = [];
  constructor(
    public dialog: MatDialog,
    public studentService: StudentService,
    public snackbar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.getStudents();
  }

  getStudents() {
    this.studentService.getStudents().subscribe((response) => {
      console.log('Students fetched successfully', response);
      this.studentsArray = response.data;
    });
  }

  addStudent() {
    let dialogRef = this.dialog.open(StudentDialog, {
      height: '420px',
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.studentService.addStudent(result).subscribe((response) => {
          console.log('Student added successfully', response);
          if (response.status == 'success') {
            this.snackbar.open('Student added successfully', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-success'],
            });
          } else {
            this.snackbar.open('Unable to add Student. Please try again.', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error'],
            });
          }
          this.getStudents();
        });
      }
      console.log('The dialog was closed', result);
    });
    // Logic to add a new student
  }
}
