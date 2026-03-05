import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LessonService } from '../service/lesson-service';
import { Router } from '@angular/router';

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
          this.router.navigate(['/lesson']);
          // this.lessonForm.reset();
          // this.allSectionsArray = [];
        } else {
          // alert('Failed to create lesson');
        }
      },
      (error: any) => {
        console.error('Error creating lesson:', error);
        // alert('An error occurred while creating the lesson');
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
