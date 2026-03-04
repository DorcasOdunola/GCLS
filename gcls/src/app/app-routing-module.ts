import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SideNavComponent } from './side-nav/side-nav.component';
import { Login } from './login/login';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  // {
  // path: 'admin',
  // component: SideNavComponent,
  // // canActivate: [adminGuard],
  // children: [
  //   { path: 'dashboard', component: DashboardComponent },
  //   { path: 'lesson', component: Lesson },
  //   { path: 'add-lesson', component: AddLesson },
  //   { path: 'lesson-section/:lesson.id', component: LessonSection },
  //   { path: 'students', component: Students },
  //   { path: 'quiz', component: Quiz },
  //   { path: 'quiz-setup', component: QuizSetup },
  //   { path: 'quiz-setup/:quiz_id', component: QuizSetup },
  // ],
  // },
  // {
  //   path: 'student',
  //   component: SideNavComponent,
  //   // canActivate: [adminGuard],
  //   children: [
  //     { path: 'dashboard', component: DashboardComponent },
  //     { path: 'lesson', component: StudentLesson },
  //     { path: 'lesson/:lesson.id', component: StudentTakeLesson },
  //     { path: 'quiz', component: StudentQuiz },
  //     { path: 'quiz/:quiz_id', component: StudentTakeQuiz },
  //   ],
  // },

  // {path: 'login', component: LoginComponent, canActivate: [UnitGuard]},
  // {path: 'registerunit', component: RegisterUnitComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
