import { TestBed, inject } from '@angular/core/testing';

import { NfcReaderService } from './nfc-reader.service';

describe('NfcReaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NfcReaderService]
    });
  });

  it('should be created', inject([NfcReaderService], (service: NfcReaderService) => {
    expect(service).toBeTruthy();
  }));
});
