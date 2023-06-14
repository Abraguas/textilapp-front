import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { User } from "src/app/models/user";
import { SessionService } from "src/app/services/session.service";
import { UserService } from "src/app/services/user.service";
import { SweetAlert } from "sweetalert/typings/core";
declare var require: any;
const swal: SweetAlert = require("sweetalert");
@Component({
    selector: "app-my-account",
    templateUrl: "./my-account.component.html",
    styleUrls: ["./my-account.component.css"],
})
export class MyAccountComponent {
    user: User;
    form: FormGroup;
    editingEnabled: boolean = false;
    private subscription = new Subscription();

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private router: Router,
        private sessionService: SessionService
    ) {
        this.form = this.formBuilder.group({
            username: [
                { value: "", disabled: true },
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(30),
                ],
            ],
            password: [
                { value: "", disabled: true },
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(30),
                ],
            ],
            name: [
                { value: "", disabled: true },
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(30),
                ],
            ],
            lastname: [
                { value: "", disabled: true },
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(30),
                ],
            ],
            phonenumber: [
                { value: "", disabled: true },
                [
                    Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(30),
                ],
            ],
            email: [
                { value: "", disabled: true },
                [Validators.required, Validators.email],
            ],
        });
    }

    ngOnInit(): void {
        this.loadUserData();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    loadUserData(): void {
        this.subscription.add(
            this.userService.getSelf().subscribe({
                next: (r: User) => {
                    this.user = r;
                    this.form.patchValue(this.user);
                },
                error: (e) => {
                    if (e.status === 403) {
                        swal({ title: 'Error!', text: 'No tienes permitido el acceso a esta pagina!', icon: 'error' }).then(() => {
                            this.router.navigate(['home']);
                            return;
                        });
                    }
                    if (e.status === 401) {
                        swal({ title: 'Tu sesión ha expirado!', text: '', icon: 'error' }).then(() => {
                            this.sessionService.logout();
                            return;
                        });
                    }
                    console.error(e);
                    return;
                },
            })
        );
    }
    toggleEditing(): void {
        if (this.editingEnabled) {
            Object.keys(this.form.controls).forEach((c) => {
                if (c !== 'password') {
                    this.form.controls[c].disable();
                }
            });
            this.loadUserData();
        } else {
            Object.keys(this.form.controls).forEach((c) => {
                if (c !== 'password') {

                    this.form.controls[c].enable();
                }
            });
        }
        this.editingEnabled = !this.editingEnabled;
    }
    save(): void {
        if (this.form.valid) {
            this.user = this.form.value as User;
            this.subscription.add(
                this.userService.updateSelf(this.user).subscribe({
                    next: (r) => {
                        swal({
                            title: "Datos actualizados exitosamente!",
                            text: `Vuelva a iniciar sesion para que los cambios tomen efecto.`,
                            icon: "success",
                        }).then(() => {
                            this.sessionService.logout();
                        });
                    },
                    error: (e) => {
                        console.log(e);
                        let errorString;
                        if (e.error.message.toLowerCase().includes('email')) {
                            errorString = 'El email ya se encuentra en uso';
                        } else if (e.error.message.toLowerCase().includes('username')) {
                            errorString = 'El usuario ya se encuentra en uso';
                        } else {
                            errorString = e.error.message;
                        }
                        swal({ title: 'Error!', text: `Error al actualizar datos: ${errorString}`, icon: 'error' });
                    },
                })
            );
        } else {
            swal({
                title: "Atención!",
                text: `Revise y complete todos los campos!`,
                icon: "warning",
            });
        }
    }
    return(): void {
        this.router.navigate(["home"]);
    }
}
