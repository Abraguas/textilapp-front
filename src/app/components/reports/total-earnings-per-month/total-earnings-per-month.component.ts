import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaymentService } from 'src/app/services/payment.service';
import { SessionService } from 'src/app/services/session.service';
import * as moment from 'moment';
import { EarningsPerMonthDTO } from 'src/app/models/earnings-per-month-dto';
import { SweetAlert } from 'sweetalert/typings/core';
import { DataEntry } from 'src/app/models/data-entry';
declare var require: any
const swal: SweetAlert = require('sweetalert');
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
    selector: 'app-total-earnings-per-month',
    templateUrl: './total-earnings-per-month.component.html',
    styleUrls: ['./total-earnings-per-month.component.css']
})
export class TotalEarningsPerMonthComponent implements OnInit, OnDestroy {
    form: FormGroup;
    report: EarningsPerMonthDTO[];
    dataEntries: DataEntry[];
    private subscription: Subscription;
    constructor(
        private sessionService: SessionService,
        private paymentService: PaymentService,
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

        // Rounding dates to the beggining and end of the months to get data of the full month rather
        // than only the period between the dates
        startDate.startOf('month');
        endDate.endOf('month');
        const startDateString = startDate.format('YYYY-MM-DDTHH:mm:ss');
        const endDateString = endDate.format('YYYY-MM-DDTHH:mm:ss');

        this.subscription.add(
            this.paymentService.getTotalEarningsPerMonth(startDateString, endDateString).subscribe({
                next: (r: EarningsPerMonthDTO[]) => {
                    this.dataEntries = r.map(x => {
                        return {
                            label: this.getMonthName(x.month) + ' ' + x.year,
                            data: x.totalEarnings
                        }
                    });
                    this.report = r;
                },
                error: (e) => {
                    if (e.status === 400) {
                        swal({ title: 'Error!', text: 'El mes de inicio no puede superar el mes final', icon: 'error' });
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
            PDF.save(`Ingresos_por_mes_(${new Date().toLocaleDateString("es-AR")}).pdf`);
        });
    }
}
