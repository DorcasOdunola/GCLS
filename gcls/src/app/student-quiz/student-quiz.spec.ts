import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentQuiz } from './student-quiz';

describe('StudentQuiz', () => {
  let component: StudentQuiz;
  let fixture: ComponentFixture<StudentQuiz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentQuiz]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentQuiz);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
