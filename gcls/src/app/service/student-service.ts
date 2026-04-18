import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(public httpClient: HttpClient) {}

  public baseUrl: string = environment.apiUrl;

  public addStudent(studentData: any) {
    return this.httpClient.post<any>(`${this.baseUrl}add_student`, studentData);
  }
  public getStudents() {
    return this.httpClient.get<any>(`${this.baseUrl}students`);
  }
}
