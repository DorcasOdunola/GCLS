import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { MaterialModule } from './material-module';
import { SideNavComponent } from './side-nav/side-nav.component';
import { Login } from './login/login';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Lesson } from './lesson/lesson';
import { provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AddLesson } from './add-lesson/add-lesson';
import { LessonSection } from './lesson-section/lesson-section';
import { Students } from './students/students';
import { Quiz } from './quiz/quiz';
import { QuizSetup } from './quiz-setup/quiz-setup';
import { StudentLesson } from './student-lesson/student-lesson';
import { StudentTakeLesson } from './student-take-lesson/student-take-lesson';
import { StudentQuiz } from './student-quiz/student-quiz';
import { StudentTakeQuiz } from './student-take-quiz/student-take-quiz';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    App,
    SideNavComponent,
    Login,
    Lesson,
    AddLesson,
    LessonSection,
    Students,
    Quiz,
    QuizSetup,
    StudentLesson,
    StudentTakeLesson,
    StudentQuiz,
    StudentTakeQuiz,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    QuillModule.forRoot({
      theme: 'snow', // global theme
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ header: 1 }, { header: 2 }],
          ['link', 'image'], // image upload enabled globally
        ],
      },
    }),
  ],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}
