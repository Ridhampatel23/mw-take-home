import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ProgramFormDialogComponent } from '../program-form-dialog/program-form-dialog';
import { ProgramsStoreService } from '../../src/app/services/programs/programs-store';
import { Programs } from '../../src/app/models';
import { AssignPeopleDialogComponent } from '../assign-people-dialog/assign-people-dialog';

@Component({
  selector: 'app-programs-list',
  standalone: true,
  templateUrl: './programs-list.html',
  imports: [CommonModule, RouterModule, MatButtonModule],
})
export class ProgramsListComponent {
  private store = inject(ProgramsStoreService);
  private dialog = inject(MatDialog);

  // FIX: use programs$ not programs
  programs$ = this.store.programs$;

  ngOnInit() {
    this.store.load();           // <-- make the GET /programs call
  }

  openCreate() {
    this.dialog.open(ProgramFormDialogComponent, { data: { mode: 'create' } })
      .afterClosed().subscribe(changed => changed && this.store.load());
  }

  openEdit(p: Programs) {
    this.dialog.open(ProgramFormDialogComponent, { data: { mode: 'edit', program: p } })
      .afterClosed().subscribe(changed => changed && this.store.load());
  }

  openAssign(p: Programs) {
    const assignedIds = p.people?.map(x => x.id) ?? [];   // ok after model change below
    this.dialog.open(AssignPeopleDialogComponent, {
      data: { programId: p.id, preselected: assignedIds }
    }).afterClosed().subscribe(changed => changed && this.store.load());
  }

  remove(p: Programs) {
    this.store.delete(p.id);
  }
}
