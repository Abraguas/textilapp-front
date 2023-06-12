import { Component, ElementRef, ViewChild } from '@angular/core';
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Workbook } from 'exceljs';

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
    openPDF(): void {
        let doc = new jsPDF('p', 'mm', 'a4');
        doc.setFontSize(25);
        doc.text("Clientes con mayor total de ventas", 30, 25);

        const startDate = moment(this.form.value.startDate).utc();
        const endDate = moment(this.form.value.endDate).utc();
        const startDateString = startDate.format('DD-MM-YYYY');
        const endDateString = endDate.format('DD-MM-YYYY');

        doc.setFontSize(20);
        doc.text(`Desde: ${startDateString}  -   Hasta: ${endDateString}`, 30, 40);
        autoTable(doc, { html: '#data-table', startY: 55 });
        console.log(new Date().toLocaleDateString("es-AR"));
        doc.save(`Ranking_Clientes_(${new Date().toLocaleDateString("es-AR")}).pdf`);
    }
    openExcel(): void {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet("Ranking de Cliente");

        worksheet.columns = [
            { header: 'Nro', key: 'id', width: 10 },
            { header: 'Usuario', key: 'username', width: 32 },
            { header: 'Nombre', key: 'name', width: 32, outlineLevel: 1 },
            { header: 'Apellido', key: 'lastname', width: 32, outlineLevel: 1 },
            { header: 'Importe total de ventas', key: 'totalMoneySpent', width: 32, outlineLevel: 1, style: { numFmt: '$ #,##0.00' } }
        ];
        let rows = [];
        for (let u of this.users) {
            let property: keyof typeof u;
            let arr = [];
            for (property in u) {
                arr.push(u[property]);
            }
            rows.push(arr);
        }
        worksheet.addTable({
            name: 'Ranking_de_clientes',
            ref: 'A1',
            style: {
                theme: 'TableStyleLight2',
                showRowStripes: true,
            },
            columns: [
                { name: 'Nro' },
                { name: 'Usuario' },
                { name: 'Nombre' },
                { name: 'Apellido' },
                { name: 'Importe total de ventas' }
            ],
            rows: rows,
        });
        workbook.xlsx.writeBuffer().then((data: any) => {
            console.log("buffer");
            const blob = new Blob([data], {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.setAttribute("style", "display: none");
            a.href = url;
            a.download = `Ranking_Clientes_(${new Date().toLocaleDateString("es-AR")}).xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        });
    }
}
