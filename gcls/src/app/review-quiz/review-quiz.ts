import { Component } from '@angular/core';
import { QuizService } from '../service/quiz-service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-review-quiz',
  standalone: false,
  templateUrl: './review-quiz.html',
  styleUrl: './review-quiz.css',
})
export class ReviewQuiz {
  public quiz_id: any;
  public quizDetails: any;
  public quizQuestionsArray: any[] = [];
  public activeQuestionId: number = 0;
  public getUserDetails: any;
  public quizAttemptDetails: any;
  public showCorrectAnswers: boolean = true;
  public showFeedback: boolean = false;
  public canGoToNextLesson: boolean = false;
  public canRetryQuiz: boolean = false;

  constructor(
    public quizService: QuizService,
    public actRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    // Initialization logic for student taking quiz can be added here
    this.quiz_id = this.actRoute.snapshot.paramMap.get('quiz_id');

    this.quizService.getQuizById({ quiz_id: this.quiz_id }).subscribe((response) => {
      console.log('Quiz details response:', response);
      if (response.status === 'success') {
        this.quizDetails = response.data;
      } else {
        this.snackBar.open('Error fetching quiz details.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });

        // Handle error case for fetching quiz details
      }
    });

    let getUserDetails = JSON.parse(localStorage.getItem('userData') || '{}');
    this.getUserDetails = getUserDetails;
    if (this.getUserDetails.user_id) {
      this.getStudentQuizAttempt();
    }
  }

  getStudentQuizAttempt() {
    // Logic to fetch the quiz attempt for the student
    let obj = { quiz_id: this.quiz_id, user_id: this.getUserDetails.user_id };
    this.quizService.getStudentQuizAttempt(obj).subscribe((response) => {
      if (response.status === 'success') {
        this.quizAttemptDetails = response.data;
        if (response.data) {
          this.getReviewStatus(this.quizAttemptDetails[0]);
          this.getQuizQuestionsForStudent();
        }
      } else {
        this.snackBar.open('Error fetching quiz attempt details.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        // Handle error case for fetching quiz attempt details
      }
    });
  }

  getReviewStatus(attempt: any) {
    if (attempt.attempt_number == 1 && attempt.result_status === 'failed') {
      this.showCorrectAnswers = true; //  show correct answers
      this.showFeedback = false; //  hide feedback
      this.canRetryQuiz = true; // allow retrying the quiz after first failed attempt
    } else if (attempt.attempt_number >= 2 && attempt.result_status === 'failed') {
      this.showCorrectAnswers = true;
      this.showFeedback = true;
      this.canGoToNextLesson = true; // allow going to next lesson after multiple failed attempts
    } else if (attempt.result_status === 'passed') {
      this.showCorrectAnswers = true;
      this.showFeedback = true;
      this.canGoToNextLesson = true; // allow going to next lesson if passed
    }
  }

  getQuizQuestionsForStudent() {
    let obj = { quiz_attempt_id: this.quizAttemptDetails[0].quiz_attempt_id };
    this.quizService.getStudentQuizQuestions(obj).subscribe((response) => {
      if (response.status == 'success') {
        this.quizQuestionsArray = response.data;
        this.activeQuestionId = this.quizQuestionsArray[0].quiz_question_id;
        this.quizQuestionsArray.map((q) => {});
      }
      if (response.status !== 'success') {
        this.snackBar.open('Error fetching quiz questions.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        // Handle error case for fetching quiz questions
      }
    });
  }

  setActive(quiz_question_id: number) {
    this.activeQuestionId = quiz_question_id;
  }

  nextQuestion() {
    let currentIndex = this.quizQuestionsArray.findIndex(
      (q) => q.quiz_question_id === this.activeQuestionId,
    );
    if (currentIndex < this.quizQuestionsArray.length - 1) {
      let nextQuestionId = this.quizQuestionsArray[currentIndex + 1].quiz_question_id;
      this.setActive(nextQuestionId);
    }
  }
  previousQuestion() {
    let currentIndex = this.quizQuestionsArray.findIndex(
      (q) => q.quiz_question_id === this.activeQuestionId,
    );
    if (currentIndex > 0) {
      let previousQuestionId = this.quizQuestionsArray[currentIndex - 1].quiz_question_id;
      this.setActive(previousQuestionId);
    }
  }
  goToNextLesson() {}
}
