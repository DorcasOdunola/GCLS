import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTakeLesson } from './student-take-lesson';

describe('StudentTakeLesson', () => {
  let component: StudentTakeLesson;
  let fixture: ComponentFixture<StudentTakeLesson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentTakeLesson]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentTakeLesson);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
