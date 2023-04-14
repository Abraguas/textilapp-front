import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginDTO } from 'src/app/models/login-dto';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private sessionService: SessionService,
    private router: Router
  ) {

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        username: [, Validators.required],
        password: [, Validators.required]
      }
    );
  }
  login(): void {
    if (this.form.valid) {
      let body = new LoginDTO();
      body = this.form.value as LoginDTO;
      this.subscription.add(
        this.userService.login(body).subscribe({
          next: (r: any) => {
            localStorage.setItem('token', r.token);
            swal({ title: 'Bienvenido/a!', icon: 'success' });
            this.sessionService.changeState(true);
            this.router.navigate(['home']);
          },
          error: (e) => { 
            let message = "Error de servidor"
            if(e.status == 403) {
              message = "Usuario y/o contraseña incorrecto"
            }
            console.log(e);
            swal({title:'Error al iniciar sesión', text: `${message}`, icon: 'error'});
          }
        })
      );
    }
    else {
      swal({ title: 'Atención', text: 'Complete los campos', icon: 'warning' });
    }
  }
  return(): void {

  }
}
