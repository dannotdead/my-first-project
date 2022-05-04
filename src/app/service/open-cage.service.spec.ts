/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OpenCageService } from './open-cage.service';

describe('Service: OpenCage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpenCageService]
    });
  });

  it('should ...', inject([OpenCageService], (service: OpenCageService) => {
    expect(service).toBeTruthy();
  }));
});
