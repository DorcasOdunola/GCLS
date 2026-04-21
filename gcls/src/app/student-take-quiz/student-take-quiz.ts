import { Component } from '@angular/core';
import { QuizService } from '../service/quiz-service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuizDialog } from '../quiz-dialog/quiz-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-student-take-quiz',
  standalone: false,
  templateUrl: './student-take-quiz.html',
  styleUrl: './student-take-quiz.css',
})
export class StudentTakeQuiz {
  public quiz_id: any;
  public quizDetails: any;
  public quizQuestionsArray: any[] = [];
  public studentChoice: string | null = null;
  public activeQuestionId: number = 0;
  public getUserDetails: any;
  public quizAttemptDetails: any;
  public isLoading: boolean = true;

  constructor(
    public quizService: QuizService,
    public actRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    // Initialization logic for student taking quiz can be added here
    this.quiz_id = this.actRoute.snapshot.paramMap.get('quiz_id');

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

  getQuizQuestionsForStudent() {
    let obj = { quiz_attempt_id: this.quizAttemptDetails[0].quiz_attempt_id };
    this.quizService.getStudentQuizQuestions(obj).subscribe((response) => {
      if (response.status == 'success') {
        this.quizQuestionsArray = response.data;
        this.activeQuestionId = this.quizQuestionsArray[0].quiz_question_id;
        this.quizQuestionsArray.map((q) => {});
        this.isLoading = false;
      }
      if (response.status !== 'success') {
        this.snackBar.open('Error fetching quiz questions.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        this.isLoading = false;
        // Handle error case for fetching quiz questions
      }
    });
  }

  // Jump to a specific ID from the sidebar
  setActive(quiz_question_id: number) {
    this.activeQuestionId = quiz_question_id;
    this.studentChoice = null;
  }

  // Next button logic using findIndex
  nextQuestion() {
    this.studentChoice = null;
    const currentIndex = this.quizQuestionsArray.findIndex(
      (q) => q.quiz_question_id === this.activeQuestionId,
    );
    if (currentIndex < this.quizQuestionsArray.length - 1) {
      let nextQuestionId = this.quizQuestionsArray[currentIndex + 1].quiz_question_id;
      this.setActive(nextQuestionId);
    }
  }
  // Previous button logic using findIndex
  previousQuestion() {
    this.studentChoice = null;
    const currentIndex = this.quizQuestionsArray.findIndex(
      (q) => q.quiz_question_id === this.activeQuestionId,
    );
    if (currentIndex > 0) {
      let previousQuestionId = this.quizQuestionsArray[currentIndex - 1].quiz_question_id;
      this.setActive(previousQuestionId);
    }
  }

  // Function to handle the click
  selectAnswer(letter: string, question: any) {
    if (question.selected_option == letter) return; // If the same option is clicked again, do nothing
    let qIndex = this.quizQuestionsArray.findIndex(
      (q) => q.quiz_question_id === question.quiz_question_id,
    );
    this.quizQuestionsArray[qIndex].selected_option = letter;
    this.quizService
      .saveStudentQuestionAnswers({
        quiz_answer_id: question.quiz_answer_id,
        selected_option: letter,
      })
      .subscribe((response) => {});
  }

  submitQuiz() {
    console.log('Submitting quiz with attempt ID:', this.quizAttemptDetails);
    console.log('Submitting quiz with attempt ID:', this.quizAttemptDetails[0].quiz_attempt_id);
    this.quizService
      .submitQuiz({ quiz_attempt_id: this.quizAttemptDetails[0].quiz_attempt_id })
      .subscribe((response) => {
        if (response.status === 'success') {
          this.dialog.open(QuizDialog, {
            data: { quizResult: response.data, status: 'view_result' },
            // height: '400px',
            // width: '600px',
          });
          console.log('Quiz submitted successfully:', response);
          // this.snackBar.open('Quiz submitted successfully!', 'Close', {
          //   duration: 3000,
          //   panelClass: ['snackbar-success'],
          // });
          // Logic to show quiz results can be added here
        } else {
          this.snackBar.open('Error submitting quiz.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
          // Handle error case for submitting quiz
        }
      });
    // Logic to submit the quiz and show results
  }
}
