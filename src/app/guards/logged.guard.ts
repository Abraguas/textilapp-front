import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { UserService } from '../services/user.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Injectable({
    providedIn: 'root'
})
export class LoggedGuard implements CanActivate {
    constructor(
        private userService: UserService,
        private router: Router
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
            catchError(() => {
                swal({ title: 'Error!', text: 'Debes iniciar sesión para acceder a esta pagina!', icon: 'error' }).then(() => {

                    this.router.navigate(['home']);
                });
                return of(false);
            }));
    }

}
