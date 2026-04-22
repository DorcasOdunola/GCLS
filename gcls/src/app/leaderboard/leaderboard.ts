import { Component } from '@angular/core';
import { LeaderboardService } from '../service/leaderboard-service';

@Component({
  selector: 'app-leaderboard',
  standalone: false,
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css',
})
export class Leaderboard {
  constructor(public leaderboardService: LeaderboardService) {}

  // No interface needed
  leaderboardData: any[] = [];
  topThree: any[] = [];
  others: any[] = [];

  processData(response: any) {
    if (response.status === 'success') {
      // TypeScript won't check if 'score' actually exists
      const sorted = response.data.sort((a: any, b: any) => b.score - a.score);

      this.topThree = sorted.slice(0, 3);
      this.others = sorted.slice(3);
      this.leaderboardData = sorted;
    }
  }

  students = [
    { name: 'Alin Dorcas', score: 980, xp: 450, lessons: 8, quizAvg: 78, progress: 70 },
    { name: 'Emeka Emeka', score: 980, xp: 350, lessons: 7, quizAvg: 78, progress: 70 },
    { name: 'John Raw', score: 450, xp: 350, lessons: 6, quizAvg: 78, progress: 70 },
  ];

  ngOnInit() {
    this.getLeaderboard();
  }

  public getLeaderboard() {
    this.leaderboardService.getLeaderboard().subscribe((response: any) => {
      this.processData(response);
      // if (response.status === 'success') {
      //   // Handle the leaderboard data if needed
      //   console.log(response.data);
      // }
    });
  }
}
