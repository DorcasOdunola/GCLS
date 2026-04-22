import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from '../service/lesson-service';
import { MatDialog } from '@angular/material/dialog';
import { LessonDialog } from '../lesson-dialog/lesson-dialog';

@Component({
  selector: 'app-student-take-lesson',
  standalone: false,
  templateUrl: './student-take-lesson.html',
  styleUrl: './student-take-lesson.css',
})
export class StudentTakeLesson {
  constructor(
    public actRoute: ActivatedRoute,
    public lessonService: LessonService,
    public dialog: MatDialog,
    public router: Router,
  ) {}
  public lesson_id: string | null = null;
  step = signal(0);
  public lessonSections: any[] = [];
  public lessonData: any = {};
  public isLoading: boolean = true;
  public getUserDetails: any;

  setStep(index: number) {
    this.step.set(index);
  }

  nextStep() {
    this.step.update((i) => i + 1);
    this.lessonSections[this.step()].disabled = false;
  }

  prevStep() {
    this.step.update((i) => i - 1);
  }

  ngOnInit(): void {
    this.lesson_id = this.actRoute.snapshot.paramMap.get('lesson.id');
    this.lessonService.getLesson({ lesson_id: this.lesson_id }).subscribe((response: any) => {
      if (response.status === 'success') {
        this.getLessonSection();
        // Handle the lesson data if needed
        this.lessonData = response.data;
      }
    });
    let getUserDetails = JSON.parse(localStorage.getItem('userData') || '{}');
    this.getUserDetails = getUserDetails;
  }

  getLessonSection() {
    // Use this.lesson_id to fetch lesson section data
    let obj = { lesson_id: this.lesson_id };
    this.lessonService.getLessonSection(obj).subscribe((response: any) => {
      if (response.status === 'success') {
        // Handle the lesson section data
        this.isLoading = false;
        this.lessonSections = response.data;
        this.lessonSections.map((section, i) => {
          if (i === 0) {
            section.disabled = false;
          } else {
            section.disabled = true;
          }
        });
      }
    });
  }

  endLesson() {
    let obj = {
      lesson_id: this.lesson_id,
      user_id: this.getUserDetails.user_id,
    };
    this.lessonService.endLesson(obj).subscribe((response: any) => {
      console.log('End lesson response:', response);
      if (response.status === 'success') {
        // Handle the end lesson response
        let dialog = this.dialog.open(LessonDialog, {
          data: { lesson_data: this.lessonData, lesson_response: response.data },
        });
        dialog.afterClosed().subscribe((result) => {
          // Handle any actions after the dialog is closed
          if (!result) {
            // Do something if the dialog is closed without a result
            this.router.navigate(['/student/lesson']);
          }
        });
      }
    });
  }
}
