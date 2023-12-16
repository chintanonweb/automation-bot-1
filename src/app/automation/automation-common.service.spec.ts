import { TestBed } from '@angular/core/testing';

import { AutomationCommonService } from './automation-common.service';

describe('AutomationCommonService', () => {
  let service: AutomationCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutomationCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
