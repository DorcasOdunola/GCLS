import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StudentService } from '../service/student-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StudentDialog } from '../student-dialog/student-dialog';
import { CenterService } from '../service/center-service';

@Component({
  selector: 'app-students',
  standalone: false,
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class Students {
  public studentsArray: any = [];
  public userDetails: any;
  public centersList: any[] = [];
  public selectedCenter: string = 'all';


  constructor(
    public dialog: MatDialog,
    public studentService: StudentService,
    public snackbar: MatSnackBar,
    public centerService: CenterService
  ) { }

  ngOnInit() {
    let userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.userDetails = userData;
    if (this.userDetails.user_id) {
      this.getStudents(this.userDetails);
      this.getAllCenters();
    }
  }

  getStudents(user_details: any) {
    const obj = {
      center_id: this.selectedCenter == 'all' ? 'all' : this.selectedCenter,
      user_id: user_details.user_id,
    };
    this.studentService.getStudents(obj).subscribe((response) => {
      console.log('Students fetched successfully', response);
      this.studentsArray = response.data;
    });
  }

  addStudent() {
    let dialogRef = this.dialog.open(StudentDialog, {
      height: '500px',
      width: '700px',
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
          this.getStudents(this.userDetails);
        });
      }
      console.log('The dialog was closed', result);
    });
    // Logic to add a new student
  }

  public getAllCenters() {
    this.centerService.getCenters().subscribe((response: any) => {
      console.log(response);
      if (response.status === 'success') {
        this.centersList = response.data;
      }
    });
  }

  onCenterChange() {
    console.log(this.selectedCenter);
    this.getStudents(this.userDetails);
  }
}
