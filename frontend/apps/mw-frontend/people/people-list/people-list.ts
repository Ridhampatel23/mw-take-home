import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PeopleStoreService } from '../../src/app/services/people/people-store';
import { PersonFormDialogComponent } from '../people-form-dialog/person-form-dialog';
import { Person } from '../../src/app/models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-people-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './people-list.html',
})
export class PeopleListComponent implements OnInit {
  readonly store = inject(PeopleStoreService);
  private readonly dialog = inject(MatDialog);

  readonly displayed: string[] = ['name', 'email', 'role', 'actions'];

  ngOnInit() {
    this.store.load();
  }

  onFilterInput(ev: Event) {
    const v = (ev.target as HTMLInputElement).value;
    this.store.setFilter(v);
  }

  openCreate() {
    this.dialog.open(PersonFormDialogComponent, {
      width: '480px',
      data: { mode: 'create' },
    });
  }

  openEdit(p: Person) {
    this.dialog.open(PersonFormDialogComponent, {
      width: '480px',
      data: { mode: 'edit', person: p },
    });
  }

  remove(id: string) {
    this.store.delete(id);
  }
}
