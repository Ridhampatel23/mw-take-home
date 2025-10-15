import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { PeopleStoreService } from '../../src/app/services/people/people-store';
import { CreatePerson, Person, Role, UpdatePerson } from '../../src/app/models';

type DialogData = { mode: 'create' } | { mode: 'edit'; person: Person };

@Component({
  selector: 'app-person-form-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule
  ],
  templateUrl: './person-form-dialog.html',
})
export class PersonFormDialogComponent implements OnInit {
  public readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<PersonFormDialogComponent, boolean>);
  private readonly store = inject(PeopleStoreService);
  private readonly fb = inject(FormBuilder);

  public readonly roles: Role[] = ['Admin', 'Member', 'Coach'];
  public readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    role: this.fb.nonNullable.control<Role>('Member', [Validators.required]),
  });

  ngOnInit() {
    if (this.data.mode === 'edit') {
      const p = this.data.person;
      this.form.patchValue({ firstName: p.firstName, lastName: p.lastName, email: p.email, role: p.role });
    }
  }

  public submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const dto = this.form.getRawValue();
    if (this.data.mode === 'create') {
      this.store.create(dto as CreatePerson, () => this.dialogRef.close(true));
    } else {
      this.store.update(this.data.person.id, dto as UpdatePerson, () => this.dialogRef.close(true));
    }
  }
}
