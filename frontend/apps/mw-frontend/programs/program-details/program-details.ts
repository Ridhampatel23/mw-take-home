import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import {
  switchMap,
  map,
  distinctUntilChanged,
  startWith,
} from 'rxjs/operators';
import { ProgramsStoreService } from '../../src/app/services/programs/programs-store';
import { AssignPeopleDialogComponent } from '../assign-people-dialog/assign-people-dialog';
import { Programs } from '../../src/app/models';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, Subject } from 'rxjs';

@Component({
  selector: 'app-program-detail',
  standalone: true,
  templateUrl: './program-details.html',
  imports: [CommonModule, RouterModule, MatButtonModule],
})
export class ProgramDetailComponent {
  private route = inject(ActivatedRoute);
  private store = inject(ProgramsStoreService);
  private dialog = inject(MatDialog);

  program$ = this.route.paramMap.pipe(
    map((params) => params.get('id')!),
    switchMap((id) => this.store.getById$(id))
  );


// a simple counter you bump to refresh
  private refreshTick = signal(0);

  private programId$ = this.program$.pipe(
    map(p => p.id),
    distinctUntilChanged()
  );

  assignedPeople = toSignal(
    combineLatest([
      this.programId$,
      toObservable(this.refreshTick).pipe(startWith(0)) // initial fetch
    ]).pipe(
      switchMap(([id]) => this.store.getAssignedIds$(id))
    ),
    { initialValue: [] }
  );

   assignedPeopleCount = computed(() => this.assignedPeople().length);


  refreshAssignments() {
    this.refreshTick.update((n: number) => n + 1);
  }


  openAssign(p: Programs) {
    this.store.getAssignedIds$(p.id).subscribe((assignedIds) => {
      this.dialog
        .open(AssignPeopleDialogComponent, {
          data: { programId: p.id, preselected: assignedIds ?? [] },
        })
        .afterClosed()
        .subscribe((changed) => {
          if (changed) {
            this.refreshAssignments();
            this.store.load();
          }
        });
    });
  }
}
