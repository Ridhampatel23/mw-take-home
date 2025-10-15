import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonFormDialogComponent } from './person-form-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('PersonFormDialogComponent', () => {
  let component: PersonFormDialogComponent;
  let fixture: ComponentFixture<PersonFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonFormDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { mode: 'create' } }, // or { mode: 'edit', person: {...} }
        { provide: MatDialogRef, useValue: { close: jest.fn() } },  // simple stub
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default role = Member', () => {
    expect(component.form.controls.role.value).toBe('Member');
  });

  it('should mark form invalid if required fields are missing', () => {
    component.form.reset();   // clear values
    expect(component.form.valid).toBe(false);
  });
});
