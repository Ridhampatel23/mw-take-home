// apps/mw-frontend/src/app/services/programs/programs-store.ts
import { Injectable, inject, signal, effect, computed } from '@angular/core';
import { ProgramsDataService } from './programs-data';
import type { Programs, CreateProgram as ProgramCreate, UpdateProgram } from '../../models';

@Injectable({ providedIn: 'root' })
export class ProgramsStoreService {
  private readonly api = inject(ProgramsDataService);

  // Signals (no BehaviorSubjects)
  private readonly _programs = signal<Programs[]>([]);
  private readonly _loading  = signal<boolean>(false);
  private readonly _error    = signal<string | null>(null);

  // Public readonly getters (so callers can’t set them)
  readonly programs = this._programs.asReadonly();
  readonly loading  = this._loading.asReadonly();
  readonly error    = this._error.asReadonly();


  constructor() {
    // initial load
    this.load();
  }

  // Imperative load that updates signals
  load() {
    this._loading.set(true);
    this.api.list().subscribe({
      next: (list) => this._programs.set(list ?? []),
      error: (e) => this._error.set(e?.error?.message ?? 'Failed to load programs'),
      complete: () => this._loading.set(false),
    });
  }


  getById$(id: string) {
    return this.api.get(id);
  }

  getAssignedIds$(programId: string) {
    return this.api.getAssignedIds(programId);
  }

  // Bulk set  (V2)
  setAssignments(programId: string, personIds: string[], done?: () => void) {
    this.api.upsertAssignments(programId, personIds).subscribe({
      next: () => { this.load(); done?.(); },
      error: (e) => { console.error('Set assignments failed', e); done?.(); },
    });
  }

  // Legacy single-call assign (optional to keep) (V1)
  assignPeople(programId: string, personIds: string[], done?: () => void) {
    this.api.assign(programId, personIds).subscribe({
      next: () => { this.load(); done?.(); },
      error: (e) => { console.error('Assign failed', e); done?.(); },
    });
  }

  create(dto: ProgramCreate, done?: () => void) {
    this.api.create(dto).subscribe({
      next: () => { this.load(); done?.(); },
      error: (e) => { console.error('Create failed', e); done?.(); },
    });
  }

  update(id: string, dto: UpdateProgram, done?: () => void) {
    this.api.update(id, dto).subscribe({
      next: () => { this.load(); done?.(); },
      error: (e) => { console.error('Update failed', e); done?.(); },
    });
  }

  delete(id: string) {
    this.api.delete(id).subscribe({
      next: () => this.load(),
      error: (e) => console.error('Delete failed', e),
    });
  }
}
