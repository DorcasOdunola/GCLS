import { Component } from '@angular/core';
import { LessonService } from '../service/lesson-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-lesson',
  standalone: false,
  templateUrl: './student-lesson.html',
  styleUrl: './student-lesson.css',
})
export class StudentLesson {
  constructor(
    public lessonService: LessonService,
    public router: Router,
    public snackbar: MatSnackBar,
  ) {}

  public lessonsArray: any[] = [];
  activeLink = this.lessonsArray[0];
  getUserDetails: any;

  ngOnInit() {
    let getUserDetails = JSON.parse(localStorage.getItem('userData') || '{}');
    this.getUserDetails = getUserDetails;
    if (this.getUserDetails.user_id) {
      this.getAllLessonsForStudent(this.getUserDetails.user_id);
    }
  }

  getAllLessonsForStudent(userId: string) {
    this.lessonService.getAllLessonsForStudent({ user_id: userId }).subscribe((response: any) => {
      if (response.status === 'success') {
        this.lessonsArray = response.data;
        this.lessonsArray.map((lesson, i) => {
          if (i === 0) {
            lesson.disabled = false;
          } else {
            lesson.disabled = true;
          }
        });
      }
      // console.log('All Lessons:', response);
    });
  }

  openLesson(lesson: any) {
    if (lesson.lesson_status === 'locked') return;

    this.router.navigate(['/student/lesson', lesson.lesson_id]);
  }
}
