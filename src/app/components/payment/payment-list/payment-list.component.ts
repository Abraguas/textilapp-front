import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, first } from 'rxjs';
import { PaymentDTO } from 'src/app/models/payment-dto';
import { PaymentService } from 'src/app/services/payment.service';
import { SessionService } from 'src/app/services/session.service';
import { SweetAlert } from 'sweetalert/typings/core';
import * as moment from 'moment';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
    selector: 'app-payment-list',
    templateUrl: './payment-list.component.html',
    styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit, OnDestroy {
    payments: PaymentDTO[];
    totalPages: number;
    currentPage: number;
    pagesToShow: number[];
    queryParams: Params;
    searchString: string;
    usernameForm: FormGroup;
    dateForm: FormGroup;
    subscription: Subscription;
    constructor(
        private paymentService: PaymentService,
        private sessionService: SessionService,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder
    ) {
        this.usernameForm = this.formBuilder.group({
            username: [,]
        })
        this.dateForm = this.formBuilder.group({
            startDate: [, [Validators.required]],
            endDate: [, [Validators.required]],
        });
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    ngOnInit(): void {
        this.subscription = new Subscription();
        this.subscription.add(
            this.route.queryParams.subscribe((params) => {
                this.loadPayments(params['pageNum'], params['searchString'], params['startDate'], params['endDate']);
            })
        );
        this.route.queryParams
            .pipe(first())
            .subscribe(params => {
                this.usernameForm.patchValue({
                    username: params['searchString'] ? params['searchString'] : ''
                });
                this.dateForm.patchValue({
                    startDate: params['startDate'] ? moment(params['startDate'], 'YYYY-MM-DDTHH:mm:ss').format("YYYY-MM-DD") : '',
                    endDate: params['endDate'] ? moment(params['endDate'], 'YYYY-MM-DDTHH:mm:ss').format("YYYY-MM-DD") : '',
                });
            });
        this.subscription.add(
            this.usernameForm.controls['username'].valueChanges.subscribe((value) => {
                this.searchString = value;
                let params: Params = {
                    searchString: '',
                    pageNum: 0
                };
                params['searchString'] = value;
                this.router.navigate(
                    [

                    ],
                    {
                        relativeTo: this.route,
                        queryParams: params,
                        queryParamsHandling: 'merge'
                    });
            })
        );
        this.subscription.add(
            this.dateForm.valueChanges.subscribe(() => {
                if (this.dateForm.valid) {
                    const startDate = moment(this.dateForm.value.startDate).utc();
                    const endDate = moment(this.dateForm.value.endDate).utc();

                    startDate.startOf('day');
                    endDate.endOf('day');

                    const startDateString = startDate.format('YYYY-MM-DDTHH:mm:ss');
                    const endDateString = endDate.format('YYYY-MM-DDTHH:mm:ss');
                    let params: Params = {
                        pageNum: 0,
                        startDate: '',
                        endDate: ''
                    };
                    params['startDate'] = startDateString;
                    params['endDate'] = endDateString;
                    this.router.navigate(
                        [

                        ],
                        {
                            relativeTo: this.route,
                            queryParams: params,
                            queryParamsHandling: 'merge'
                        });

                }
            })
        );
    }
    loadPayments(page: number | undefined, username: string | undefined,
        startDate: string | undefined, endDate: string | undefined): void {
        this.subscription.add(
            this.paymentService.getAllPaginated(page ? page : 0, 15, username ? username : '', startDate, endDate).subscribe({
                next: (r: any) => {
                    this.payments = r.result;
                    this.currentPage = r.currentPage;
                    this.totalPages = r.totalPages;
                    this.getPagesToShow(2);
                },
                error: (e) => {
                    if (this.statusCheck(e)) {
                        swal({ title: 'Error!', text: 'Se ha producido un error al cargar los pagos', icon: 'error' });
                    }
                }
            })
        );
    }
    payOrder(orderId: number): void {
        this.router.navigate(['pay-order'],
            { queryParams: { 'external_reference': orderId } });
    }

    getPagesToShow(margin: number): void {
        const pages: number[] = [];
        const startPage = Math.max(0, this.currentPage - margin);
        const endPage = Math.min(this.totalPages - 1, this.currentPage + margin);

        for (let page = startPage; page <= endPage; page++) {
            pages.push(page);
        }
        this.pagesToShow = pages;
    }
    goToPage(page: number): void {
        console.log("a");
        this.currentPage = page;
        let params: Params = {
            pageNum: 0
        };
        params['pageNum'] = page;
        this.router.navigate(
            [

            ],
            {
                relativeTo: this.route,
                queryParams: params,
                queryParamsHandling: 'merge'
            });
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
