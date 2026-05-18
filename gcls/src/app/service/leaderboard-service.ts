import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  constructor(public httpClient: HttpClient) { }
  public baseUrl: string = environment.apiUrl;

  public getLeaderboard(obj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}leaderboard`, obj);
  }
}
