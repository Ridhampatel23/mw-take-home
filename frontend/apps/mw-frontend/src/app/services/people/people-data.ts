import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreatePerson, Person, UpdatePerson } from '../../models';
import { environment } from '../../../../env';

const API = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class PeopleDataService {
  private http = inject(HttpClient);

  /** Gets all people. */
  list() {
    return this.http.get<Person[]>(`${API}/people`);
  }

  /** Gets a person by ID.
   * @param id The ID of the person.
   */
  get(id: string) {
    return this.http.get<Person>(`${API}/people/${id}`);
  }

  /** Creates a new person.
   * @param dto The person data to create.
   */
  create(dto: CreatePerson) {
    return this.http.post<Person>(`${API}/people`, dto);
  }

  /** Updates an existing person.
   * @param id The ID of the person to update.
   * @param dto The updated person data.
   */
  update(id: string, dto: UpdatePerson) {
    return this.http.put<Person>(`${API}/people/${id}`, dto);
  }

  /** Deletes a person by ID.
   * @param id The ID of the person to delete.
   */
  delete(id: string) {
    return this.http.delete<void>(`${API}/people/${id}`);
  }
}

