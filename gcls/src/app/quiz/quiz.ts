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
  ) {
    this.quizForm = this.formBuilder.group({
      title: [''],
      instruction: [''],
      duration: [''],
      lesson_id: [],
      // questions: this.formBuilder.array([]),
    });
    this.quizQuestionsForm = this.formBuilder.group({
      question: [''],
      option_a: [''],
      option_b: [''],
      option_c: [''],
      option_d: [''],
      correct_answer: [''],
      feedback: [''],

      // Define controls for quiz questions here
    });
  }

  ngOnInit() {
    // Initialize quiz form or data here
    this.lessonService.getAllLessons().subscribe((lessons) => {
      this.lessonsArray = lessons.data;
    });
    this.getAllQuiz();
  }

  getAllQuiz() {
    this.quizArray = [
      {
        id: 1,
        quiz_title: 'QUIZ: LESSON QUIZ',
        lesson_topic: 'LESSON 1',
        questions_count: 20,
        quizzes_written: 3,
        created_at: '2025-11-05',
        status: 'open',
        thumbnail_alt: 'Notebook with pencil and eraser',
      },
      {
        id: 2,
        quiz_title: 'QUIZ: LESSON QUIZ',
        lesson_topic: 'LESSON 1',
        questions_count: 20,
        quizzes_written: 3,
        created_at: '2025-11-05',
        status: 'open',
        thumbnail_alt: 'Notebook with pencil and eraser',
      },
      {
        id: 3,
        quiz_title: 'QUIZ: LESSON QUIZ',
        lesson_topic: 'LESSON 1',
        questions_count: 20,
        quizzes_written: 3,
        created_at: '2025-11-05',
        status: 'open',
        thumbnail_alt: 'Notebook with pencil and eraser',
      },
      {
        id: 4,
        quiz_title: 'QUIZ: LESSON QUIZ',
        lesson_topic: 'LESSON 1',
        questions_count: 20,
        quizzes_written: 3,
        created_at: '2025-11-05',
        status: 'open',
        thumbnail_alt: 'Notebook with pencil and eraser',
      },
      {
        id: 5,
        quiz_title: 'QUIZ: LESSON QUIZ',
        lesson_topic: 'LESSON 1',
        questions_count: 20,
        quizzes_written: 3,
        created_at: '2025-11-05',
        status: 'open',
        thumbnail_alt: 'Notebook with pencil and eraser',
      },
      {
        id: 6,
        quiz_title: 'QUIZ: LESSON QUIZ',
        lesson_topic: 'LESSON 1',
        questions_count: 20,
        quizzes_written: 3,
        created_at: '2025-11-05',
        status: 'open',
        thumbnail_alt: 'Notebook with pencil and eraser',
      },
    ];
    // this.quizService.getQuizById().subscribe((quizzes) => {
    //   console.log('Quizzes fetched:', quizzes);
    //   if (quizzes.status == 'success') {
    //     this.quizArray = quizzes.data;
    //   } else {
    //     this.quizArray = [];
    //     this.snackBar.open('No quizzes found.', 'Close', { duration: 3000 });
    //   }
    // });
  }

  formQuizTitle(event: any) {
    let lesson = this.lessonsArray.find((lesson: any) => {
      return lesson.lesson_id === parseInt(this.quizForm.get('lesson_id').value);
    });
    let quizTitle = lesson.topic + ' - ' + 'Quiz';
    this.quizForm.get('title').setValue(quizTitle);
  }

  createQuiz() {
    console.log(this.quizForm.value);
  }

  openQuiz(quiz_id: any) {
    this.quizService.quiz_id.next(quiz_id);
  }
}
