import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LessonService } from '../service/lesson-service';
import { QuizService } from '../service/quiz-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-quiz-setup',
  standalone: false,
  templateUrl: './quiz-setup.html',
  styleUrl: './quiz-setup.css',
})
export class QuizSetup {
  public quizForm: any;
  public quizQuestionsForm: any;
  public lessonsArray: any = [];
  public quizTitle: string = '';
  public isLoading: boolean = false;
  public quiz_id: any;
  public questionArray: any = [];
  public activeQuestionId: any;
  public isEditMode: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public lessonService: LessonService,
    public quizService: QuizService,
    public snackBar: MatSnackBar,
    public actRoute: ActivatedRoute,
  ) {
    this.quizForm = this.formBuilder.group({
      quiz_title: [''],
      instructions: [''],
      duration: [''],
      lesson_id: [],
    });

    this.quizQuestionsForm = this.formBuilder.group({
      question: [''],
      option_a: [''],
      option_b: [''],
      option_c: [''],
      option_d: [''],
      correct_option: [''],
      feedback: [''],
      // Define controls for quiz questions here
    });
  }

  ngOnInit() {
    // Initialize quiz form or data here
    this.lessonService.getAllLessons().subscribe((lessons) => {
      this.lessonsArray = lessons.data;
    });
    this.quiz_id = this.actRoute.snapshot.paramMap.get('quiz_id');
    if (this.quiz_id && this.quiz_id > 0) {
      this.getQuizDetails(this.quiz_id);
    }
  }

  formQuizTitle(event: any) {
    let lesson = this.lessonsArray.find((lesson: any) => {
      return lesson.lesson_id === parseInt(this.quizForm.get('lesson_id').value);
    });
    this.quizTitle = lesson.topic + ' - ' + 'Quiz';
    this.quizForm.get('title').setValue(this.quizTitle);
  }

  createQuiz() {
    this.quizTitle = this.quizForm.get('title').value;
    this.isLoading = true;
    this.quizService.createQuiz(this.quizForm.value).subscribe((response) => {
      this.quizForm.disable();
      if (response.status !== 'success') {
        this.snackBar.open('Error creating quiz. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        this.isLoading = false;
        return;
      }
      this.snackBar.open('Quiz created successfully! Kindly proceed to add questions', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success'],
      });
      this.isLoading = false;
      this.quizService.quiz_id.next(response.data.quiz_id);
    });
  }

  getQuizDetails(quiz_id: any) {
    // this.isLoading = true;
    // // Fetch and populate quiz details for editing
    // this.quizService.getQuiz({ quiz_id: 1 }).subscribe((response) => {
    //   if (response.status !== 'success') {
    //     this.snackBar.open('Error fetching quiz details.', 'Close', {
    //       duration: 3000,
    //       panelClass: ['snackbar-error'],
    //     });
    //     return;
    //   }
    //   this.quizForm.patchValue(response.data);
    //   this.quizTitle = response.data.quiz_title;
    //   this.questionArray = response.data.questions;
    //   this.quizForm.disable();
    //   this.isLoading = false;
    // });
  }

  editQuiz() {
    this.quizForm.enable();
    this.isEditMode = true;
  }

  updateQuiz() {
    this.isLoading = true;
    let obj = {
      ...this.quizForm.value,
      quiz_id: this.quiz_id,
    };
    this.quizService.updateQuiz(obj).subscribe((response) => {
      if (response.status !== 'success') {
        this.snackBar.open('Error updating quiz. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        this.isLoading = false;
        return;
      }
      this.snackBar.open('Quiz updated successfully!', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success'],
      });
      this.quizForm.disable();
      this.isEditMode = false;
      this.isLoading = false;
    });
  }

  addQuestion() {
    // Logic to add a question to the quiz
    this.isLoading = true;
    let objectToSend = {
      ...this.quizQuestionsForm.value,
      quiz_id: this.quiz_id,
    };
    this.quizService.addQuestion(objectToSend).subscribe((response) => {
      if (response.status !== 'success') {
        this.snackBar.open('Error adding question. Please try again.', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
        return;
      }
      this.snackBar.open('Question added successfully!', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success'],
      });
      this.quizQuestionsForm.reset();
      this.isLoading = false;
      this.getQuizDetails(this.quiz_id);
    });
  }

  viewQuestion(quiz_question_id: number) {
    // Logic to view a specific question
    let question = this.questionArray.find((q: any) => q.quiz_question_id === quiz_question_id);
    this.activeQuestionId = question.quiz_question_id;
    this.quizQuestionsForm.patchValue(question);
  }

  updateQuestion() {
    // Logic to update a specific question
    let obj = {
      ...this.quizQuestionsForm.value,
      quiz_id: this.quiz_id,
      quiz_question_id: this.activeQuestionId,
    };
    this.quizService.updateQuestion(obj).subscribe((response) => {
      if (response.status !== 'success') {
        this.snackBar.open('Error updating question. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        this.isLoading = false;
        return;
      }
      this.snackBar.open('Question updated successfully!', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success'],
      });
      this.quizQuestionsForm.reset();
      this.activeQuestionId = null;
      this.isLoading = false;
      this.getQuizDetails(this.quiz_id);
    });
  }
}
