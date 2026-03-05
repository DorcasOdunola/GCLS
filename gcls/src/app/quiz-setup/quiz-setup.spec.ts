import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizSetup } from './quiz-setup';

describe('QuizSetup', () => {
  let component: QuizSetup;
  let fixture: ComponentFixture<QuizSetup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuizSetup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizSetup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
