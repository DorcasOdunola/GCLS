import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  constructor(public httpClient: HttpClient) {}

  public baseUrl: string = environment.apiUrl;

  public addLesson(obj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}add_lesson`, obj);
  }

  public getAllLessons() {
    return this.httpClient.get<any>(`${this.baseUrl}get_all_lessons`);
  }
  public getAllLessonsForStudent(obj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}get_all_lessons_for_student`, obj);
  }

  public getLessonSection(obj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}lesson_section`, obj);
  }

  public getLesson(obj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}get_lesson`, obj);
  }

  public endLesson(obj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}end_lesson`, obj);
  }
}
