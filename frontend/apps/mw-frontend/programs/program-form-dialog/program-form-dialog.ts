import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProgramsStoreService } from '../../src/app/services/programs/programs-store';
import type { CreateProgram as ProgramCreate, UpdateProgram, Programs } from '../../src/app/models';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';

type DialogData = { mode: 'create' } | { mode: 'edit'; program: Programs };

@Component({
  selector: 'app-program-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatNativeDateModule,
    MatDatepicker,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './program-form-dialog.html',
})
export class ProgramFormDialogComponent implements OnInit {
  data = inject<DialogData>(MAT_DIALOG_DATA);
  ref = inject(MatDialogRef<ProgramFormDialogComponent, boolean>);
  store = inject(ProgramsStoreService);
  fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required, Validators.maxLength(1000)]],
    startDate: [null as Date | null, Validators.required],
    endDate: [null as Date | null, Validators.required],
  });

  private toYMD(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  ngOnInit() {
    if (this.data.mode === 'edit') {
      const p = this.data.program;
      this.form.patchValue({
        name: p.name,
        description: p.description,
        // Convert 'YYYY-MM-DD' strings from the API into Date objects for the picker
        startDate: p.startDate ? new Date(p.startDate) : null,
        endDate: p.endDate ? new Date(p.endDate) : null,
      });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();

    const dto = {
      name: v.name,
      description: v.description,
      startDate: this.toYMD(v.startDate!),  // CreateProgram expects strings
      endDate: this.toYMD(v.endDate!),
    };

    if (this.data.mode === 'create')
      this.store.create(dto as ProgramCreate, () => this.ref.close(true));
    else
      this.store.update(this.data.program.id, dto as UpdateProgram, () => this.ref.close(true));
  }
}
