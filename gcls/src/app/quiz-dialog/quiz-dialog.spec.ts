import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizDialog } from './quiz-dialog';

describe('QuizDialog', () => {
  let component: QuizDialog;
  let fixture: ComponentFixture<QuizDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuizDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
