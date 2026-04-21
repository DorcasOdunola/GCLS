import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuizService } from '../service/quiz-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-dialog',
  standalone: false,
  templateUrl: './quiz-dialog.html',
  styleUrl: './quiz-dialog.css',
})
export class QuizDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<QuizDialog>,
    public quizService: QuizService,
    public snackBar: MatSnackBar,
    public router: Router,
  ) {}

  quizData: any;
  getUserDetails: any;

  quizState: 'pass' | 'retry' | 'blocked' = 'retry';
  quizResult: any;

  ngOnInit() {
    console.log('QuizDialog initialized with data:', this.data);
    if (this.data.status === 'open_quiz') {
      this.quizData = this.data;

      let getUserDetails = JSON.parse(localStorage.getItem('userData') || '{}');
      this.getUserDetails = getUserDetails;
    }

    if (this.data.status === 'view_result') {
      this.quizResult = this.data.quizResult;
      this.calculateState();
    }
  }

  startQuiz() {
    // This Logic create a quiz attempt for the student before starting the quiz. It can be used to track the student's progress and score throughout the quiz attempt.
    let obj = {
      score: 0,
      status: 0, // 0 for in-progress, 1 for completed
      quiz_id: this.data.quiz_id,
      user_id: this.getUserDetails.user_id,
    };
    console.log('Creating quiz attempt with data:', obj);
    this.quizService.createQuizAttempt(obj).subscribe((response) => {
      if (response.status === 'success') {
        this.dialogRef.close();
        this.router.navigate([`/student/quiz/${this.data.quiz_id}`]);
      } else {
        this.snackBar.open('Error creating quiz attempt.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        // Handle error case for quiz attempt creation
      }
    });
  }

  calculateState() {
    if (this.quizResult.percentage >= 70) {
      this.quizState = 'pass';
    } else if (this.quizResult.percentage >= 50 && this.quizResult.percentage <= 69) {
      this.quizState = 'retry';
    } else {
      this.quizState = 'blocked';
    }

    // else if (this.quizResult.attempt < this.data.maxAttempts) {
    //   this.quizState = 'retry';
    // }
  }

  nextLesson() {
    this.dialogRef.close('next');
  }
  retry() {
    this.dialogRef.close('retry');
  }
}
