import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurelinkComponent } from './securelink.component';

describe('SecurelinkComponent', () => {
  let component: SecurelinkComponent;
  let fixture: ComponentFixture<SecurelinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurelinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurelinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
