import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLesson } from './student-lesson';

describe('StudentLesson', () => {
  let component: StudentLesson;
  let fixture: ComponentFixture<StudentLesson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentLesson]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentLesson);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
