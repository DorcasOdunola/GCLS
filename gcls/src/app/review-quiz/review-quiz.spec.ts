import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewQuiz } from './review-quiz';

describe('ReviewQuiz', () => {
  let component: ReviewQuiz;
  let fixture: ComponentFixture<ReviewQuiz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewQuiz]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewQuiz);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
