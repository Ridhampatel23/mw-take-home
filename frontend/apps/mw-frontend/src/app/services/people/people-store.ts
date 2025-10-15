import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { PeopleDataService } from './people-data';
import { CreatePerson, Person, UpdatePerson } from '../../models';

@Injectable({ providedIn: 'root' })
export class PeopleStoreService {
  private readonly api = inject(PeopleDataService);

  private readonly _people = signal<Person[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _filter = signal('');

  readonly people = computed(() => {
    const q = this._filter().toLowerCase().trim();
    const data = this._people();
    if (!q) return data;
    return data.filter(p => `${p.firstName} ${p.lastName} ${p.email}`.toLowerCase().includes(q));
  });
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());
  get filterValue() { return this._filter(); }

  setFilter(v: string) { this._filter.set(v); }

  load() {
    this._loading.set(true);
    this._error.set(null);
    this.api.list()
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: rows => this._people.set(rows),
        error: e => this._error.set(e?.error?.message ?? 'Failed to load people'),
      });
  }

  create(dto: CreatePerson, onDone?: () => void) {
    this._loading.set(true);
    this.api.create(dto)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: p => { this._people.update(arr => [p, ...arr]); onDone?.(); },
        error: e => this._error.set(e?.error?.message ?? 'Create failed'),
      });
  }

  update(id: string, dto: UpdatePerson, onDone?: () => void) {
    this._loading.set(true);
    this.api.update(id, dto)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: p => { this._people.update(arr => arr.map(x => x.id === id ? p : x)); onDone?.(); },
        error: e => this._error.set(e?.error?.message ?? 'Update failed'),
      });
  }

  delete(id: string) {
    this._loading.set(true);
    this.api.delete(id)
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: () => this._people.update(arr => arr.filter(x => x.id !== id)),
        error: e => this._error.set(e?.error?.message ?? 'Delete failed'),
      });
  }
}
