import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTakeQuiz } from './student-take-quiz';

describe('StudentTakeQuiz', () => {
  let component: StudentTakeQuiz;
  let fixture: ComponentFixture<StudentTakeQuiz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentTakeQuiz]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentTakeQuiz);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
