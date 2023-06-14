import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { UserService } from '../services/user.service';
import { SweetAlert } from 'sweetalert/typings/core';
import { SessionService } from '../services/session.service';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Injectable({
    providedIn: 'root'
})
export class LoggedGuard implements CanActivate {
    constructor(
        private userService: UserService,
        private router: Router,
        private sessionService: SessionService
    ) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.userService.getRole().pipe(
            map((role: any) => {
                if (role.token == 'CLIENT' || role.token == 'ADMIN') {
                    return true;
                }
                swal({ title: 'Error!', text: 'Debes iniciar sesión para acceder a esta pagina!', icon: 'error' }).then(() => {

                    this.router.navigate(['home']);
                });
                return false;
            }),
            catchError((e) => {
                console.error(e);
                if (e.status === 403) {
                    swal({ title: 'Error!', text: 'No tienes permitido el acceso a esta pagina!', icon: 'error' }).then(() => {
                        this.router.navigate(['home']);
                    });
                    return of(false);
                }
                if (e.status === 401) {
                    swal({ title: 'Error!', text: 'Tu sesión ha expirado!', icon: 'error' }).then(() => {

                        this.sessionService.logout();
                    });
                    return of(false);
                }
                if (e.status === 0) {
                    swal({ title: 'El servidor se encuentra caido!', text: 'Intenta denuevo más tarde, lamentamos el inconveniente', icon: 'error' }).then(() => {
                        this.sessionService.logout();
                    });
                    return of(false);
                }
                swal({ title: 'Error de servidor!', text: '', icon: 'error' }).then(() => {

                    this.router.navigate(['home']);
                });
                return of(false);
            }));
    }

}
