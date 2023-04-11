import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class SessionService {
  private sesionSubject: Subject<boolean>;
  constructor() { 
    this.sesionSubject = new Subject<boolean>;
  }

  changeState(x: boolean){
    this.sesionSubject.next(x);
  }

  sessionChanged = (): Observable<boolean> => this.sesionSubject.asObservable();
}
