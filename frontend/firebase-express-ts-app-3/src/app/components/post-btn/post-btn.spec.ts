import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostBtn } from './post-btn';

describe('PostBtn', () => {
  let component: PostBtn;
  let fixture: ComponentFixture<PostBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostBtn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostBtn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
