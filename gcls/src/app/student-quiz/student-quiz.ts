import { Component } from '@angular/core';
import { QuizService } from '../service/quiz-service';
import { MatDialog } from '@angular/material/dialog';
import { QuizDialog } from '../quiz-dialog/quiz-dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-quiz',
  standalone: false,
  templateUrl: './student-quiz.html',
  styleUrl: './student-quiz.css',
})
export class StudentQuiz {
  public quizArray: any = [];
  getUserDetails: any;

  constructor(
    public quizService: QuizService,
    public dialog: MatDialog,
    public router: Router,
  ) {}

  ngOnInit() {
    // Initialization logic for student quiz can be added here
    let getUserDetails = JSON.parse(localStorage.getItem('userData') || '{}');
    this.getUserDetails = getUserDetails;
    if (this.getUserDetails.user_id) {
      this.geAllQuiz(this.getUserDetails.user_id);
    }
  }

  geAllQuiz(user_id: number) {
    this.quizService.getQuizForStudent({ user_id }).subscribe((response) => {
      this.quizArray = response.data;
      // Handle the fetched quizzes as needed
    });
  }

  openQuiz(quiz: any) {
    // This involve navigating to the quiz-taking component or displaying the quiz questions
    console.log('Opening quiz:', quiz);
    this.dialog.open(QuizDialog, {
      data: { quiz, status: 'open_quiz' },
      // height: '400px',
      // width: '600px',
    });
  }

  getQuizUIState(quiz: any) {
    // 1. Lesson locked
    if (quiz.lesson_status === 'locked' || quiz.lesson_status === 'in_progress') {
      return {
        action: 'disabled',
        label: 'Locked',
        disabled: true,
      };
    }

    // 2. No attempt yet
    if (quiz.attempt_status === 'not_started') {
      return {
        action: 'start',
        label: 'Open',
        disabled: false,
      };
    }

    // 3. First failure → retry
    if (quiz.attempt_status === 'failed' && quiz.attempt_number == 1) {
      return {
        action: 'retry',
        label: 'Retry',
        disabled: false,
      };
    }

    // 4. Second failure → locked (review only)
    if (quiz.attempt_status === 'failed' && quiz.attempt_number >= 2) {
      return {
        action: 'review',
        label: 'Review',
        disabled: true,
      };
    }

    // 5. Passed
    if (quiz.attempt_status === 'passed') {
      return {
        action: 'review',
        label: 'Review',
        disabled: true,
      };
    }

    return {
      action: 'unknown',
      label: 'Open',
      disabled: false,
    };
  }

  handleQuizAction(quiz: any) {
    const state = this.getQuizUIState(quiz);

    switch (state.action) {
      case 'start':
        this.openQuiz(quiz);
        break;

      case 'retry':
        this.openQuiz(quiz);
        break;

      case 'review':
        this.router.navigate(['/student/review-quiz', quiz.quiz_id]);
        break;

      // case 'result':
      //   this.router.navigate(['/student/result', quiz.quiz_id]);
      //   break;
      default:
        break;
    }
  }
}
