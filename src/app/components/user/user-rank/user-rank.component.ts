import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserRankingDTO } from 'src/app/models/user-ranking-dto';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');
@Component({
    selector: 'app-user-rank',
    templateUrl: './user-rank.component.html',
    styleUrls: ['./user-rank.component.css']
})
export class UserRankComponent {
    users: UserRankingDTO[];
    private subscription: Subscription;
    constructor(
        private sessionService: SessionService,
        private userService: UserService,
        private router: Router,
        private formBuilder: FormBuilder
    ) { }
    ngOnInit(): void {
        this.subscription = new Subscription();
        this.loadUsers();
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    loadUsers(): void {
        this.subscription.add(
            this.userService.getRanking().subscribe({
                next: (r: UserRankingDTO[]) => {
                    this.users = r;
                },
                error: (e) => {
                    if (this.statusCheck(e)) {
                        swal({ title: 'Error!', text: 'Se ha producido un error al cargar los usuarios', icon: 'error' });
                    }
                }
            })
        );
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
