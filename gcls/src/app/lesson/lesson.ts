import { Component } from '@angular/core';
import { LessonService } from '../service/lesson-service';

@Component({
  selector: 'app-lesson',
  standalone: false,
  templateUrl: './lesson.html',
  styleUrl: './lesson.css',
})
export class Lesson {
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

  nextSection(index: number) {
    console.log(this.lessonsArray[index]);
    this.lessonsArray[index].disabled = false;
    console.log(this.lessonsArray[index]);
  }
}
