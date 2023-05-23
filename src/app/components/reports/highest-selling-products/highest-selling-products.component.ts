import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import * as moment from 'moment';
import { SweetAlert } from 'sweetalert/typings/core';
import { DataEntry } from 'src/app/models/data-entry';
import { HighestSellingProductDTO } from 'src/app/models/highest-selling-product-dto';
import { OrderService } from 'src/app/services/order.service';
declare var require: any
const swal: SweetAlert = require('sweetalert');
@Component({
    selector: 'app-highest-selling-products',
    templateUrl: './highest-selling-products.component.html',
    styleUrls: ['./highest-selling-products.component.css']
})
export class HighestSellingProductsComponent implements OnInit, OnDestroy {
    form: FormGroup;
    report: HighestSellingProductDTO[];
    dataEntries: DataEntry[];
    private subscription: Subscription;
    constructor(
        private sessionService: SessionService,
        private orderService: OrderService,
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
    loadReport(): void {
        const startDate = moment(this.form.value.startDate).utc();
        const endDate = moment(this.form.value.endDate).utc();
        // Round the start date to the beginning of the month
        startDate.startOf('day');

        console.log(startDate);
        // Round the end date to the end of the month
        endDate.endOf('day');
        const startDateString = startDate.format('YYYY-MM-DDTHH:mm:ss');
        const endDateString = endDate.format('YYYY-MM-DDTHH:mm:ss');

        this.subscription.add(
            this.orderService.getHighestSellingProducts(startDateString, endDateString).subscribe({
                next: (r: HighestSellingProductDTO[]) => {
                    this.dataEntries = r.map(x => {
                        return {
                            label: x.productName,
                            data: x.quantitySold
                        }
                    });
                    this.report = r;
                },
                error: (e) => {
                    if (e.status === 400) {
                        swal({ title: 'Error!', text: 'La fecha de inicio no puede superar la fecha final', icon: 'error' });
                        return;
                    }
                    if (this.statusCheck(e)) {
                        swal({ title: 'Error!', text: 'Se ha producido un error al cargar el reporte', icon: 'error' });
                    }
                }
            })
        );
    }
    getMonthName(monthNumber: number): any {
        const date = new Date();
        date.setMonth(monthNumber - 1);

        const str = date.toLocaleString('es-AR', { month: 'long' });
        return str.charAt(0).toUpperCase() + str.slice(1);
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
