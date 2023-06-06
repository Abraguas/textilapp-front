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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

        startDate.startOf('day');
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
    openPDF(): void {
        let DATA: any = document.getElementById('htmlData');
        html2canvas(DATA).then((canvas) => {
            let fileWidth = 300;
            let fileHeight = (canvas.height * fileWidth) / canvas.width;
            const FILEURI = canvas.toDataURL('image/png');
            let PDF = new jsPDF('l', 'mm', 'a4');
            let position = 0;
            PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
            console.log(new Date().toLocaleDateString("es-AR"));
            PDF.save(`Productos_mas_vendidos_(${new Date().toLocaleDateString("es-AR")}).pdf`);
        });
    }
}
