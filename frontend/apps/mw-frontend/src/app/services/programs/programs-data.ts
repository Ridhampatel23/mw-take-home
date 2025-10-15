// apps/mw-frontend/src/app/programs/programs-data.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Programs, CreateProgram, UpdateProgram } from '../../models';
import { environment } from '../../../../env';

const API = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ProgramsDataService {
  private http = inject(HttpClient);

  /** Gets all programs. */
  list() {
    return this.http.get<Programs[]>(`${API}/programs`);
  }

  /** Gets a program by ID.
   * @param id The ID of the program.
   */
  get(id: string) {
    return this.http.get<Programs>(`${API}/programs/${id}`);
  }

  /** Creates a new program.
   * @param dto The program data to create.
   */
  create(dto: CreateProgram) {
    return this.http.post<Programs>(`${API}/programs`, dto);
  }


  /** Updates an existing program.
   * @param id The ID of the program to update.
   * @param dto The updated program data.
   */
  update(id: string, dto: UpdateProgram) {
    return this.http.put<Programs>(`${API}/programs/${id}`, dto);
  }

  /** Deletes a program by ID.
   * @param id The ID of the program to delete.
   */
  delete(id: string) {
    return this.http.delete<void>(`${API}/programs/${id}`);
  }

  // assignment
  assign(programId: string, personIds: string[]) {
    return this.http.post(`${API}/programs/${programId}/assign`, { personIds });
  }
  remove(programId: string, personId: string) {
    return this.http.delete(`${API}/programs/${programId}/remove/${personId}`);
  }
}
