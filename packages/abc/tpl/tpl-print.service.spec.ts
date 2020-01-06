import { TestBed } from '@angular/core/testing';

import { TplPrintService } from './tpl-print.service';

describe('TplPrintService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TplPrintService = TestBed.get(TplPrintService);
    expect(service).toBeTruthy();
  });
});
