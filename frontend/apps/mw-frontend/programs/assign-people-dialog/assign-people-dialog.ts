import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PeopleDataService } from '../../src/app/services/people/people-data';
import { ProgramsStoreService } from '../../src/app/services/programs/programs-store';
import type { Person } from '../../src/app/models';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';

type DialogData = { programId: string; preselected: string[] };

@Component({
  selector: 'app-assign-people-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogClose,
  ],
  templateUrl: './assign-people-dialog.html',
})
export class AssignPeopleDialogComponent implements OnInit {
  private readonly peopleApi = inject(PeopleDataService);
  private readonly store = inject(ProgramsStoreService);
  private readonly ref = inject(
    MatDialogRef<AssignPeopleDialogComponent, boolean>
  );
  private readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  form = new FormGroup({ checks: new FormArray<FormControl<boolean>>([]) });
  people: Person[] = [];
  people$: Observable<Person[]> = of([]);

  get checks() {
    return this.form.get('checks') as FormArray<FormControl<boolean>>;
  }

  trackById = (_: number, p: Person) => p.id;

  ngOnInit(): void {
    this.people$ = this.peopleApi.list().pipe(
      tap((list) => {
        this.people = list ?? [];
        // rebuild form array every time the list changes
        this.checks.clear();
        for (const p of this.people) {
          const checked = this.data.preselected?.includes(p.id) ?? false;
          this.checks.push(
            new FormControl<boolean>(checked, { nonNullable: true })
          );
        }
      }),
      catchError((err) => {
        console.error('Failed to load people', err);
        this.people = [];
        this.checks.clear();
        return of([]);
      }),
      shareReplay(1)
    );
  }

  save(): void {
    if (!this.people.length) { this.ref.close(false); return; }

    const selectedIds = this.checks.controls
      .map((ctrl, i) => (ctrl.value ? this.people[i].id : null))
      .filter((v): v is string => !!v);

    // Single bulk call replaces all assignments (adds + removes)
    this.store.setAssignments(this.data.programId, selectedIds, () => this.ref.close(true));
  }

}
