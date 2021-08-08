import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplayinterComponent } from './replayinter.component';

describe('ReplayinterComponent', () => {
  let component: ReplayinterComponent;
  let fixture: ComponentFixture<ReplayinterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplayinterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplayinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
