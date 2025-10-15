import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { switchMap, map } from 'rxjs/operators';
import { ProgramsStoreService } from '../../src/app/services/programs/programs-store';
import { AssignPeopleDialogComponent } from '../assign-people-dialog/assign-people-dialog';
import { Programs } from '../../src/app/models';

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

  openAssign(p: Programs) {
    this.store.getAssignedIds$(p.id).subscribe((assignedIds) => {
      this.dialog
        .open(AssignPeopleDialogComponent, {
          data: { programId: p.id, preselected: assignedIds ?? [] },
        })
        .afterClosed()
        .subscribe((changed) => changed && this.store.load());
    });
  }
}
