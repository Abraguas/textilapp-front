import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StockMovementProdDTO } from 'src/app/models/stock-movement-prod-dto';
import { SessionService } from 'src/app/services/session.service';
import { StockMovementService } from 'src/app/services/stock-movement.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
    selector: 'app-all-stock-movements-list',
    templateUrl: './all-stock-movements-list.component.html',
    styleUrls: ['./all-stock-movements-list.component.css']
})
export class AllStockMovementsListComponent {
    private subscription = new Subscription();
    stockMovements: StockMovementProdDTO[];
    Math: any = Math;
    constructor(
        private stockMovementService: StockMovementService,
        private router: Router,
        private sessionService: SessionService
    ) {
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    ngOnInit(): void {
        this.loadMovements();
    }
    loadMovements(): void {
        this.subscription.add(
            this.stockMovementService.getAllMovements().subscribe({
                next: (r: StockMovementProdDTO[]) => {
                    this.stockMovements = r;
                },
                error: (e) => {
                    this.statusCheck(e);
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
