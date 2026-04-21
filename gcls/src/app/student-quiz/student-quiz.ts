import { Component } from '@angular/core';
import { QuizService } from '../service/quiz-service';
import { MatDialog } from '@angular/material/dialog';
import { QuizDialog } from '../quiz-dialog/quiz-dialog';

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
}
