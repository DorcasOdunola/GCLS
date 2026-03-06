import { Component } from '@angular/core';
import { LessonService } from '../service/lesson-service';
import { FormBuilder } from '@angular/forms';
import { QuizService } from '../service/quiz-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-quiz',
  standalone: false,
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz {
  public quizForm: any;
  public quizQuestionsForm: any;
  public lessonsArray: any = [];
  public quizArray: any = [];

  constructor(
    public formBuilder: FormBuilder,
    public lessonService: LessonService,
    public quizService: QuizService,
    public snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    // Initialize quiz form or data here
    this.lessonService.getAllLessons().subscribe((lessons) => {
      this.lessonsArray = lessons.data;
    });
    this.getAllQuiz();
  }

  getAllQuiz() {
    this.quizService.getQuiz().subscribe((quizzes) => {
      console.log('Quizzes fetched:', quizzes);
      if (quizzes.status == 'success') {
        this.quizArray = quizzes.data;
      } else {
        this.quizArray = [];
        this.snackBar.open('No quizzes found.', 'Close', { duration: 3000 });
      }
    });
  }

  openQuiz(quiz_id: any) {
    this.quizService.quiz_id.next(quiz_id);
  }
}
