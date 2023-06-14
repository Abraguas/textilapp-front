import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChangePasswordDTO } from 'src/app/models/change-password-dto';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';
import { SweetAlert } from "sweetalert/typings/core";
declare var require: any;
const swal: SweetAlert = require("sweetalert");
@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
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
                oldPassword: [, Validators.required],
                newPassword: [, Validators.required],
                repeatPassword: [, Validators.required]
            }
        );
    }
    changePassword(): void {
        if (this.form.valid) {
            this.subscription.add(
                this.userService.updatePassword(this.form.value as ChangePasswordDTO).subscribe({
                    next: (r: any) => {
                        swal({
                            title: "Datos actualizados exitosamente!",
                            text: `Vuelva a iniciar sesion con su nueva contraseña.`,
                            icon: "success",
                        }).then(() => {
                            this.sessionService.logout();
                        });
                    },
                    error: (e) => {
                        if (e.status === 401) {
                            swal({ title: 'Error!', text: 'La contraseña anterior es incorrecta! Cerrando sesión...', icon: 'error' }).then(() => {
                                this.sessionService.logout();
                            });
                            return;
                        }
                        if (e.status === 400) {
                            swal({ title: 'Error!', text: 'Revise los campos!', icon: 'error' });
                            return;
                        }
                        if (this.statusCheck(e)) {
                            swal({ title: 'Error!', text: 'Se ha producido un error al registrar el producto', icon: 'error' });
                            return;
                        }
                    }
                })
            );
        }
        else {
            swal({ title: 'Atención', text: 'Complete los campos', icon: 'warning' });
        }
    }
    statusCheck(e: any): boolean {
        if (e.status === 403) {
            swal({ title: 'Error!', text: 'No tienes permitido el acceso a esta pagina!', icon: 'error' }).then(() => {

                this.router.navigate(['home']);
            });
            return false;
        }
        if (e.status === 401) {
            swal({ title: 'Tu sesión ha expirado!', text: '', icon: 'error' }).then(() => {
                this.sessionService.logout();
            });
            return false;
        }
        if (e.status === 0) {
            swal({ title: 'El servidor se encuentra caido!', text: 'Intenta denuevo más tarde, lamentamos el inconveniente', icon: 'error' }).then(() => {
                this.sessionService.logout();
                return false;
            });
        }
        console.error(e);
        return true;
    }
}
