import { TestBed } from '@angular/core/testing';
import { PeopleStoreService } from './people-store';


describe('PeopleStore', () => {
  let service: PeopleStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeopleStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
