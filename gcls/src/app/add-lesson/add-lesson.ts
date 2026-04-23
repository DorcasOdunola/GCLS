import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LessonService } from '../service/lesson-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-lesson',
  standalone: false,
  templateUrl: './add-lesson.html',
  styleUrl: './add-lesson.css',
})
export class AddLesson {
  public lessonForm;
  public isEditable = true;
  public sectionForm;

  public allSectionsArray: any = [];
  public allClassesArray: any = [];
  public allSubjectsArray: any = [];

  constructor(
    public formBuilder: FormBuilder,
    public lessonService: LessonService,
    public router: Router,
    public snackbar: MatSnackBar,
  ) {
    this.lessonForm = this.formBuilder.group({
      topic: [''],
      sub_topic: [''],
      instructional_obj: [''],
      class_subject_id: [''],
      lesson_duration: [''],
      lesson_date: [''],
      sections: [''],
      class_id: [''],
      subject_id: [''],
    });
    this.sectionForm = this.formBuilder.group({
      section: [''],
    });
  }

  ngOnInit() {
    // this.classService.getClasses().subscribe((response: any) => {
    //   if (response.status === 'success') {
    //     this.allClassesArray = response.data;
    //   } else {
    //     this.allClassesArray = [];
    //   }
    // });
    // this.subjectService.getAllSubjects().subscribe((response: any) => {
    //   if (response.status === 'success') {
    //     this.allSubjectsArray = response.data;
    //   } else {
    //     this.allSubjectsArray = [];
    //   }
    // });
  }

  createLesson() {
    let sectionObject = {
      section: this.sectionForm.value.section,
    };
    this.allSectionsArray.push(sectionObject);
    this.lessonForm.value.sections = this.allSectionsArray;
    this.lessonService.addLesson(this.lessonForm.value).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          console.log('Lesson created successfully');
          this.snackbar.open('Lesson created successfully', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
          this.router.navigate(['/admin/lesson']);
          // this.lessonForm.reset();
          // this.allSectionsArray = [];
        } else {
          this.snackbar.open('Failed to create lesson', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
        }
      },
      (error: any) => {
        console.error('Error creating lesson:', error);
        this.snackbar.open('An error occurred while creating the lesson', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      },
    );
  }

  addMoreSections() {
    let sectionObject = {
      section: this.sectionForm.value.section,
    };
    this.allSectionsArray.push(sectionObject);
    console.log(this.allSectionsArray);
    this.sectionForm.reset();
  }

  reset() {
    this.lessonForm.reset();
    this.sectionForm.reset();
    this.allSectionsArray = [];
  }
}
