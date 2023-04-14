import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Injectable()
export class SessionService {
  private sesionSubject: Subject<boolean>;
  constructor(
    private router: Router
  ) { 
    this.sesionSubject = new Subject<boolean>;
  }

  changeState(x: boolean){
    this.sesionSubject.next(x);
  }
  logout(): void {

        localStorage.removeItem('token');
        this.changeState(false);
        this.router.navigate(['home']);
        swal("Hasta pronto!", {
          icon: "success",
        });

  }

  sessionChanged = (): Observable<boolean> => this.sesionSubject.asObservable();
}
