import { Component } from '@angular/core';
import { LessonService } from '../service/lesson-service';

@Component({
  selector: 'app-student-lesson',
  standalone: false,
  templateUrl: './student-lesson.html',
  styleUrl: './student-lesson.css',
})
export class StudentLesson {
  constructor(public lessonService: LessonService) {}

  public lessonsArray: any[] = [];
  activeLink = this.lessonsArray[0];

  ngOnInit() {
    this.getAllLessons();
  }

  getAllLessons() {
    this.lessonService.getAllLessons().subscribe((response: any) => {
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
}
