import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ProgramFormDialogComponent } from '../program-form-dialog/program-form-dialog';
import { ProgramsStoreService } from '../../src/app/services/programs/programs-store';
import { Programs } from '../../src/app/models';
import { AssignPeopleDialogComponent } from '../assign-people-dialog/assign-people-dialog';
import { MatTableModule } from '@angular/material/table';


@Component({
  selector: 'app-programs-list',
  standalone: true,
  templateUrl: './programs-list.html',
  styleUrl: './programs-list.css',
  imports: [CommonModule, RouterModule, MatButtonModule, MatTableModule],
})
export class ProgramsListComponent {
  protected store = inject(ProgramsStoreService);
  private dialog = inject(MatDialog);

  programs = this.store.programs;

  ngOnInit() {
    this.store.load();
  }
  displayedColumns = ['name', 'description', 'dates', 'actions'];


  openCreate() {
    this.dialog
      .open(ProgramFormDialogComponent, { data: { mode: 'create' } })
      .afterClosed()
      .subscribe((changed) => changed && this.store.load());
  }

  openEdit(p: Programs) {
    this.dialog
      .open(ProgramFormDialogComponent, { data: { mode: 'edit', program: p } })
      .afterClosed()
      .subscribe((changed) => changed && this.store.load());
  }

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

  remove(p: Programs) {
    this.store.delete(p.id);
  }
}
