import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonScore } from './lesson-score';

describe('LessonScore', () => {
  let component: LessonScore;
  let fixture: ComponentFixture<LessonScore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LessonScore]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonScore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
