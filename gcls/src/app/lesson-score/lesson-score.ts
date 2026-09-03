import { Component } from '@angular/core';
import { LessonService } from '../service/lesson-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lesson-score',
  standalone: false,
  templateUrl: './lesson-score.html',
  styleUrl: './lesson-score.css',
})
export class LessonScore {
  constructor(
    public lessonService: LessonService,
    public activatedRoute: ActivatedRoute,
  ) {}

  lessonId: string | null = null;
  public lessonScores: any[] = [];
  public summary: any = {};

  ngOnInit(): void {
    this.lessonId = this.activatedRoute.snapshot.paramMap.get('lesson_id');
    console.log('Lesson ID:', this.lessonId);
    this.lessonScore();
  }

  lessonScore() {
    const obj = {
      lesson_id: this.lessonId,
    };

    this.lessonService.lessonScores(obj).subscribe((response: any) => {
      console.log('Lesson Scores:', response);

      if (response.status === 'success') {
        this.lessonScores = response.data.students;
        this.summary = response.data.summary;
      }
    });
  }
}
