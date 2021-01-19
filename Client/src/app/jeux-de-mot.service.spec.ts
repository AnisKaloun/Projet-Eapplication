import { TestBed } from '@angular/core/testing';

import { JeuxDeMotService } from './jeux-de-mot.service';

describe('JeuxDeMotService', () => {
  let service: JeuxDeMotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JeuxDeMotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
