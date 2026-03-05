import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonSection } from './lesson-section';

describe('LessonSection', () => {
  let component: LessonSection;
  let fixture: ComponentFixture<LessonSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LessonSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
