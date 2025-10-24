import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramsListComponent } from './programs-list';

describe('ProgramsList', () => {
  let component: ProgramsListComponent;
  let fixture: ComponentFixture<ProgramsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
