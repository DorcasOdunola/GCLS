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

  public getLessonSection(obj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}lesson_section`, obj);
  }
}
