import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitatorDialogComponent } from './facilitator-dialog.component';

describe('FacilitatorDialogComponent', () => {
  let component: FacilitatorDialogComponent;
  let fixture: ComponentFixture<FacilitatorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilitatorDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FacilitatorDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
