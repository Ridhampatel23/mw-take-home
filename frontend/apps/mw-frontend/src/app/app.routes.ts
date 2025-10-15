import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'programs' },

  {
    path: 'programs',
    loadComponent: () =>
      import('../../programs/programs-list/programs-list')
        .then(m => m.ProgramsListComponent),
  },
  {
    path: 'programs/:id',
    loadComponent: () =>
      import('../../programs/program-details/program-details')
        .then(m => m.ProgramDetailComponent),  // keep singular name
  },
  {
    path: 'people',
    loadComponent: () =>
      import('../../people/people-list/people-list')
        .then(m => m.PeopleListComponent),
  },

  { path: '**', redirectTo: 'programs' },
];
