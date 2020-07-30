import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

export interface SpinnerState {
  show: boolean;
}

@Injectable()
export class SpinnerService {
  private spinnerSubject = new Subject<SpinnerState>();
  spinnerState = this.spinnerSubject.asObservable();

  constructor() {}

  load() {
    this.spinnerSubject.next(<SpinnerState>{ show: true });
  }

  hide() {
    this.spinnerSubject.next(<SpinnerState>{ show: false });
  }
}
