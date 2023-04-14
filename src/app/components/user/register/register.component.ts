import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClientRegisterDTO } from 'src/app/models/client-register-dto';
import { UserService } from 'src/app/services/user.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  form: FormGroup;
  private subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.form = this.formBuilder.group(
      {
        username: [, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
        password: [, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
        name: [, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
        lastname: [, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
        phonenumber: [, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
        email: [, [Validators.required, Validators.email]]
      }
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  register(): void {
    if (this.form.valid) {
      let body: ClientRegisterDTO = this.form.value as ClientRegisterDTO;
      this.subscription.add(
        this.userService.registerClient(body).subscribe({
          next: (r) => {
            swal({ title: 'Listo!', text: `Usuario registrado exitosamente. Proceda a iniciar sesión con las mismas credenciales.`, icon: 'success' }).then(() =>{
              this.router.navigate(['login']);
            });
            
          },
          error: (e) => {
            console.log(e);
            swal({ title: 'Error!', text: `Error al registrarse: ${e.error.message}`, icon: 'error' });
          }
        })
      );
    }
    else {
      swal({ title: 'Atención!', text: `Revise y complete todos los campos!`, icon: 'warning' });
    }
  }

  return(): void {
    this.router.navigate(['home']);
  }
}
