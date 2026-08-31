import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakPopoverComponent } from './break-popover.component';

describe('BreakPopoverComponent', () => {
  let component: BreakPopoverComponent;
  let fixture: ComponentFixture<BreakPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreakPopoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BreakPopoverComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
