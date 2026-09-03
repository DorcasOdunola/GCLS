import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonService } from '../service/lesson-service';

@Component({
  selector: 'app-lesson-section',
  standalone: false,
  templateUrl: './lesson-section.html',
  styleUrl: './lesson-section.css',
})
export class LessonSection {
  constructor(
    public actRoute: ActivatedRoute,
    public lessonService: LessonService,
    public router: Router,
  ) {}
  public lessonId: string | null = null;
  step = signal(0);
  public lessonSections: any[] = [];
  public lessonData: any = {};
  public isLoading: boolean = true;

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
    this.lessonId = this.actRoute.snapshot.paramMap.get('lesson.id');
    this.lessonService.getLesson({ lesson_id: this.lessonId }).subscribe((response: any) => {
      if (response.status === 'success') {
        this.getLessonSection();
        // Handle the lesson data if needed
        this.lessonData = response.data;
      }
    });
  }

  getLessonSection() {
    // Use this.lessonId to fetch lesson section data
    let obj = { lesson_id: this.lessonId };
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

  lessonScore() {
    console.log('Navigating to lesson score for lesson ID:', this.lessonId);
    this.router.navigate(['/admin/lesson-score', this.lessonId]);
  }
}
