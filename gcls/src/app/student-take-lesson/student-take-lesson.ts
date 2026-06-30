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
  public isSubmitting: boolean = false; // <--- Added flag to prevent double clicks

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
        this.lessonData = response.data;
      }
    });
    let getUserDetails = JSON.parse(localStorage.getItem('userData') || '{}');
    this.getUserDetails = getUserDetails;
  }

  getLessonSection() {
    let obj = { lesson_id: this.lesson_id };
    this.lessonService.getLessonSection(obj).subscribe((response: any) => {
      if (response.status === 'success') {
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
    // 1. Prevent execution if already submitting
    if (this.isSubmitting) return;

    // 2. Set submitting state to true
    this.isSubmitting = true;

    let obj = {
      lesson_id: this.lesson_id,
      user_id: this.getUserDetails.user_id,
    };

    this.lessonService.endLesson(obj).subscribe({
      next: (response: any) => {
        console.log('End lesson response:', response);
        if (response.status === 'success') {
          let dialog = this.dialog.open(LessonDialog, {
            data: { lesson_data: this.lessonData, lesson_response: response.data },
          });
          dialog.afterClosed().subscribe((result) => {
            // Reset state upon routing away or closing
            this.isSubmitting = false;
            if (!result) {
              this.router.navigate(['/student/lesson']);
            }
          });
        } else {
          // Reset state if server sends an error status so they can retry
          this.isSubmitting = false;
        }
      },
      error: (err) => {
        // Reset state on HTTP network failures
        this.isSubmitting = false;
        console.error('Error ending lesson:', err);
      },
    });
  }
}
