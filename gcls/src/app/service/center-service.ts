import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CenterService {
  constructor(private http: HttpClient) { }

  public baseUrl: string = environment.apiUrl;

  addCenter(center: any) {
    return this.http.post(`${this.baseUrl}add_center`, center);
  }

  getCenters() {
    return this.http.get(`${this.baseUrl}get_centers`);
  }
}
