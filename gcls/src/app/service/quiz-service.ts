import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor(public httpClient: HttpClient) {}

  public quiz_id = new BehaviorSubject(0);
  public baseUrl: string = environment.apiUrl;

  public createQuiz(obj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}create_quiz`, obj);
  }

  public getQuizById(obj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}get_quiz`, obj);
  }

  public updateQuiz(obj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}update_quiz`, obj);
  }

  public getQuiz() {
    return this.httpClient.get<any>(`${this.baseUrl}quizzes`);
  }

  public addQuestion(obj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}add_question`, obj);
  }

  public updateQuestion(obj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}update_question`, obj);
  }

  public createQuizAttempt(obj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}create_quiz_attempt`, obj);
  }

  public getStudentQuizAttempt(obj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}get_student_quiz_attempt`, obj);
  }

  public getStudentQuizQuestions(obj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}get_student_quiz_questions`, obj);
  }

  public saveStudentQuestionAnswers(obj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}save_student_question_answers`, obj);
  }

  public submitQuiz(obj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}submit_quiz`, obj);
  }
}
