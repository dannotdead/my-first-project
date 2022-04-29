/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClearMapService } from './clear-map.service';

describe('Service: ClearMap', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClearMapService]
    });
  });

  it('should ...', inject([ClearMapService], (service: ClearMapService) => {
    expect(service).toBeTruthy();
  }));
});
