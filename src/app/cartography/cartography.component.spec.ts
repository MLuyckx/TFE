import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartographyComponent } from './cartography.component';

describe('CartographyComponent', () => {
  let component: CartographyComponent;
  let fixture: ComponentFixture<CartographyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartographyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
