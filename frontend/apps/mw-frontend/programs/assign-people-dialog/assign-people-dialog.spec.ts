import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignPeopleDialogComponent } from './assign-people-dialog';

describe('AssignPeopleDialog', () => {
  let component: AssignPeopleDialogComponent;
  let fixture: ComponentFixture<AssignPeopleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignPeopleDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignPeopleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
