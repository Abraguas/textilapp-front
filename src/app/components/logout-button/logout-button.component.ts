import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-logout-button',
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.css']
})
export class LogoutButtonComponent {

  constructor(private router: Router, private sessionService: SessionService) { }

  logout(): void {
    swal({
      title: "Cerrar sesión",
      text: "¿Seguro que quiere cerrar la sesión?",
      icon: "warning",
      dangerMode: true,
      buttons: {
        cancel: true,
        confirm: true,
      }
    })
    .then((cerrarSesion: boolean) => {
      if (cerrarSesion) {
        this.sessionService.logout();
      }
    });

  }
}
