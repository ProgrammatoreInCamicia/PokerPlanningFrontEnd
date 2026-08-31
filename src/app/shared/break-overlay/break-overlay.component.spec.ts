import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakOverlayComponent } from './break-overlay.component';

describe('BreakOverlayComponent', () => {
  let component: BreakOverlayComponent;
  let fixture: ComponentFixture<BreakOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreakOverlayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BreakOverlayComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
