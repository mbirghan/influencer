import { TestBed } from '@angular/core/testing';

import { FB } from './fb.service';

describe('FbService', () => {
  let service: FB;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FB);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
