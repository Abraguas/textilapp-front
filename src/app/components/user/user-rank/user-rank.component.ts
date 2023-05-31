import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
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
    form: FormGroup;
    users: UserRankingDTO[];
    private subscription: Subscription;
    constructor(
        private sessionService: SessionService,
        private userService: UserService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {
        this.form = this.formBuilder.group({
            startDate: [, [Validators.required]],
            endDate: [, [Validators.required]],
        });
    }
    ngOnInit(): void {
        this.subscription = new Subscription();
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    loadUsers(): void {
        const startDate = moment(this.form.value.startDate).utc();
        const endDate = moment(this.form.value.endDate).utc();

        startDate.startOf('day');
        endDate.endOf('day');

        const startDateString = startDate.format('YYYY-MM-DDTHH:mm:ss');
        const endDateString = endDate.format('YYYY-MM-DDTHH:mm:ss');

        this.subscription.add(
            this.userService.getRanking(startDateString, endDateString).subscribe({
                next: (r: UserRankingDTO[]) => {
                    this.users = r;
                },
                error: (e) => {
                    if (e.status === 400) {
                        swal({ title: 'Error!', text: 'La fecha de inicio no puede superar la fecha final', icon: 'error' });
                        return;
                    }
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
