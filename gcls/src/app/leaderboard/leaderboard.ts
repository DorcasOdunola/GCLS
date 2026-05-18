import { Component } from '@angular/core';
import { LeaderboardService } from '../service/leaderboard-service';
import { StudentService } from '../service/student-service';
import { CenterService } from '../service/center-service';

@Component({
  selector: 'app-leaderboard',
  standalone: false,
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css',
})
export class Leaderboard {
  constructor(public leaderboardService: LeaderboardService, public studentService: StudentService, public centerService: CenterService) { }

  public selectedCenter = "all";
  public userDetails: any;

  // No interface needed
  leaderboardData: any[] = [];
  topThree: any[] = [];
  others: any[] = [];
  centersList: any[] = [];

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
    let userData = JSON.parse(localStorage.getItem('userData') || '{}');
    this.userDetails = userData;
    if (this.userDetails.user_id) {
      this.getLeaderboard(this.userDetails);
      this.getCenters();
    }
  }

  public getLeaderboard(user_details: any) {
    let obj = {
      center_id: this.selectedCenter == 'all' ? 'all' : this.selectedCenter,
      user_id: user_details.user_id,
    };
    this.leaderboardService.getLeaderboard(obj).subscribe((response: any) => {
      this.processData(response);
      // if (response.status === 'success') {
      //   // Handle the leaderboard data if needed
      //   console.log(response.data);
      // }
    });
  }

  public getCenters() {
    this.centerService.getCenters().subscribe((response: any) => {
      this.centersList = response.data;
    });
  }

  public onCenterChange() {
    this.getLeaderboard(this.userDetails);
  }
}
