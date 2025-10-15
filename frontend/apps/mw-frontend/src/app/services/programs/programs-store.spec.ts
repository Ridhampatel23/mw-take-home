import { TestBed } from '@angular/core/testing';

import { ProgramsStore } from './programs-store';

describe('ProgramsStore', () => {
  let service: ProgramsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgramsStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
