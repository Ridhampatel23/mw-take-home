import { TestBed } from '@angular/core/testing';

import { ProgramsData } from './programs-data';

describe('ProgramsData', () => {
  let service: ProgramsData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgramsData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
