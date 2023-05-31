import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, first } from 'rxjs';
import { GetOrderDTO } from 'src/app/models/get-order-dto';
import { OrderService } from 'src/app/services/order.service';
import { SessionService } from 'src/app/services/session.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
    selector: 'app-all-orders-page',
    templateUrl: './all-orders-page.component.html',
    styleUrls: ['./all-orders-page.component.css']
})
export class AllOrdersPageComponent implements OnInit, OnDestroy {
    usernameForm: FormGroup;
    orders: GetOrderDTO[];
    totalPages: number;
    currentPage: number;
    pagesToShow: number[];
    queryParams: Params;
    subscription: Subscription;
    constructor(
        private orderService: OrderService,
        private sessionService: SessionService,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder
    ) {
        this.usernameForm = this.formBuilder.group({
            username: [,]
        })
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    ngOnInit(): void {
        this.subscription = new Subscription();
        this.subscription.add(
            this.route.queryParams.subscribe((params) => {
                this.loadOrders(params['pageNum'], params['searchString']);
            })
        );
        this.route.queryParams
            .pipe(first())
            .subscribe(params => {
                this.usernameForm.patchValue({
                    username: params['searchString'] ? params['searchString'] : ''
                });
            });
        this.subscription.add(
            this.usernameForm.controls['username'].valueChanges.subscribe((value) => {
                let params: Params = {
                    searchString: ''
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
    }
    loadOrders(page: number | undefined, username: string | undefined): void {
        this.subscription.add(
            this.orderService.getAllPaginated(page ? page : 0, 15, username ? username : '').subscribe({
                next: (r: any) => {
                    this.orders = r.result;
                    this.currentPage = r.currentPage;
                    this.totalPages = r.totalPages;
                    this.getPagesToShow(2);
                },
                error: (e) => {
                    if (this.statusCheck(e)) {
                        swal({ title: 'Error!', text: 'Se ha producido un error al cargar los pedidos', icon: 'error' });
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
