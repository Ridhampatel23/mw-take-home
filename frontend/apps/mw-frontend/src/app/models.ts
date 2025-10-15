export type Role = 'Admin' | 'Member' | 'Coach';

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  createdAt: string; // ISO string from API
}

export interface CreatePerson {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface Programs {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;

  // Optional fields that the UI references
  people?: Person[];
  peopleCount?: number;
}

export interface CreateProgram {
  name: string;
  description: string;
  startDate: string; // 'YYYY-MM-DD'
  endDate: string;   // 'YYYY-MM-DD'
}

export interface UpdatePerson extends CreatePerson {}
export interface UpdateProgram extends CreateProgram {}

