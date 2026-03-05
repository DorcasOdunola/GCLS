import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
  standalone: false,
})
export class SideNavComponent {
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay(),
  );

  public adminNavItems = [
    { name: 'Dashboard', route: '/admin/dashboard', icon: 'dashboard' },
    { name: 'Students', route: '/admin/students', icon: 'school' },
    { name: 'Lessons', route: '/admin/lesson', icon: 'library_add' },
    { name: 'Quiz', route: '/admin/quiz', icon: 'quiz' },
    { name: 'Leaderboard', route: '/admin/lesson', icon: 'leaderboard' },
  ];
  public studentNavItems = [
    { name: 'Dashboard', route: '/student/dashboard', icon: 'dashboard' },
    { name: 'Lessons', route: '/student/lesson', icon: 'library_add' },
    { name: 'Quiz', route: '/student/quiz', icon: 'quiz' },
    { name: 'Leaderboard', route: '/student/lesson', icon: 'leaderboard' },
  ];

  public navItems: any = [];

  ngOnInit() {
    // const userData = localStorage.getItem('userData');
    // if (userData) {
    //   const user = JSON.parse(userData);
    //   if (user.user_type === 1) {
    //     this.navItems = this.studentNavItems;
    //   } else if (user.user_type === 0) {
    //     this.navItems = this.adminNavItems;
    //   }
    // }
    this.navItems = this.adminNavItems;
  }
}
