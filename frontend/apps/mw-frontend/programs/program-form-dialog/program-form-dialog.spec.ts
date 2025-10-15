import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramFormDialogComponent } from './program-form-dialog';

describe('ProgramFormDialog', () => {
  let component: ProgramFormDialogComponent;
  let fixture: ComponentFixture<ProgramFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramFormDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
