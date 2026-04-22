import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-lesson-dialog',
  standalone: false,
  templateUrl: './lesson-dialog.html',
  styleUrl: './lesson-dialog.css',
})
export class LessonDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  public lessonData: any = {};
  public lessonResponse: any = {};

  ngOnInit() {
    this.lessonData = this.data.lesson_data;
    this.lessonResponse = this.data.lesson_response;
  }
}
