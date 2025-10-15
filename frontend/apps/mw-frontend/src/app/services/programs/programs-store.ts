import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import type {
  CreateProgram as ProgramCreate,
  Programs,
  UpdateProgram,
} from '../../models';
import { environment } from '../../../../env';

@Injectable({ providedIn: 'root' })
export class ProgramsStoreService {
  private http = inject(HttpClient);
  private readonly base = environment.apiUrl;


  private _programs = new BehaviorSubject<Programs[]>([]);
  programs$ = this._programs.asObservable();

  // auto-load so lists populate without remembering to call load() elsewhere
  constructor() {
    this.load();
  }

 /** Get only the assigned person IDs for a program. */
  getAssignedIds$(programId: string) {
        return this.http.get<string[]>(`${this.base}/programs/${programId}/people/ids`);
      }

  /** Assign and then refresh programs list (same as before). */
  assignPeople(programId: string, personIds: string[], done?: () => void) {
        this.http.post(`${this.base}/programs/${programId}/assign`, { personIds })
          .subscribe({
              next: () => { this.load(); done?.(); },
              error: (e) => { console.error('Assign people failed', e); done?.(); },
            });
      }

  load() {
    this.http.get<Programs[]>(`${this.base}/programs`).subscribe({
      next: (list) => this._programs.next(list),
      error: (err) => console.error('Failed to load programs', err),
    });
  }

  getById$(id: string) {
    return this.http.get<Programs>(`${this.base}/programs/${id}`);
  }


  create(dto: ProgramCreate, done?: () => void) {
    this.http.post<Programs>(`${this.base}/programs`, dto).subscribe({
      next: () => { this.load(); done?.(); },
      error: (e) => { console.error('Create failed', e); done?.(); },
    });
  }

  update(id: string, dto: UpdateProgram, done?: () => void) {
    this.http.put<Programs>(`${this.base}/programs/${id}`, dto).subscribe({
      next: () => { this.load(); done?.(); },
      error: (e) => { console.error('Update failed', e); done?.(); },
    });
  }

  delete(id: string) {
    this.http.delete(`${this.base}/programs/${id}`).subscribe({
      next: () => this.load(),
      error: (e) => console.error('Delete failed', e),
    });
  }


}

