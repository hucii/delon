import { TestBed } from '@angular/core/testing';

import { TplEditService } from './tpl-edit.service';

describe('TplEditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TplEditService = TestBed.get(TplEditService);
    expect(service).toBeTruthy();
  });
});
