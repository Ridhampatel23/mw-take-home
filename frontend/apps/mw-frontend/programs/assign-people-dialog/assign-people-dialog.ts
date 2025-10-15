import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
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
  templateUrl: './assign-people-dialog.html',
  styleUrls: ['./assign-people-dialog.css'],
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatButtonModule, MatCheckboxModule],
})
export class AssignPeopleDialogComponent implements OnInit {
  private readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject<MatDialogRef<AssignPeopleDialogComponent, boolean>>(MatDialogRef);
  private readonly peopleApi = inject(PeopleDataService);
  protected readonly store = inject(ProgramsStoreService);

  people: Person[] = [];

  people$: Observable<Person[]> = of([] as Person[]);

  form = new FormGroup({
    checks: new FormArray<FormControl<boolean>>([]),
  });

  get checks(): FormArray<FormControl<boolean>> {
    return this.form.get('checks') as FormArray<FormControl<boolean>>;
  }

  trackById = (_: number, p: Person) => p.id;


  ngOnInit(): void {
    this.people$ = this.peopleApi.list().pipe(
      tap((people: Person[]) => {
        this.people = people;
        this.checks.clear();
        const pre = new Set(this.data?.preselected ?? []);
        this.people.forEach((p) =>
          this.checks.push(new FormControl<boolean>(pre.has(p.id), { nonNullable: true })),
        );
      }),
      catchError((e) => {
        console.error('Failed to load people', e);
        return of([] as Person[]);
      }),
      shareReplay(1),
    );
  }

  save(): void {
    if (!this.people.length) {
      this.ref.close(false);
      return;
    }
    const selectedIds: string[] = this.checks.controls
      .map((ctrl, i) => (ctrl.value ? this.people[i].id : null))
      .filter((v): v is string => !!v);

    this.store.assignPeople(this.data.programId, selectedIds, () => this.ref.close(true));
  }
}
