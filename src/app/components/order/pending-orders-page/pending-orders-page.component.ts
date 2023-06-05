import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, first } from 'rxjs';
import { GetOrderDTO } from 'src/app/models/get-order-dto';
import { OrderState } from 'src/app/models/order-state';
import { PaymentMethod } from 'src/app/models/payment-method';
import { AuxiliarService } from 'src/app/services/auxiliar.service';
import { OrderService } from 'src/app/services/order.service';
import { PaymentService } from 'src/app/services/payment.service';
import { SessionService } from 'src/app/services/session.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
    selector: 'app-pending-orders-page',
    templateUrl: './pending-orders-page.component.html',
    styleUrls: ['./pending-orders-page.component.css']
})
export class PendingOrdersPageComponent implements OnInit, OnDestroy {
    usernameForm: FormGroup;
    searchString: string;
    form: FormGroup;
    orders: GetOrderDTO[];
    orderStates: OrderState[];
    paymentMethods: PaymentMethod[];
    selectedOrderId: number;
    subscription: Subscription;
    totalPages: number;
    currentPage: number;
    pagesToShow: number[];
    queryParams: Params;
    constructor(
        private orderService: OrderService,
        private sessionService: SessionService,
        private router: Router,
        private route: ActivatedRoute,
        private paymentService: PaymentService,
        private formBuilder: FormBuilder,
        private auxiliarService: AuxiliarService
    ) {
        this.form = this.formBuilder.group({
            orderState: [, [Validators.required]],
        })
        this.usernameForm = this.formBuilder.group({
            username: [,]
        })
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    ngOnInit(): void {
        this.subscription = new Subscription();
        this.loadOrderStates();
        this.loadPaymentMethods();
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

    }
    selectOrder(id: number) {
        this.selectedOrderId = id;
    }
    loadOrderStates(): void {
        this.subscription.add(
            this.auxiliarService.getOrderStates().subscribe({
                next: (r: OrderState[]) => {
                    this.orderStates = r;
                },
                error: (e) => {
                    if (this.statusCheck(e)) {
                        swal({ title: 'Error!', text: 'Se ha producido un error al cargar los estados de pedido', icon: 'error' });
                    }
                }
            })
        );
    }
    loadPaymentMethods(): void {
        this.subscription.add(
            this.paymentService.getPaymentMethods().subscribe({
                next: (r: PaymentMethod[]) => {
                    this.paymentMethods = r;
                },
                error: (e) => {
                    if (this.statusCheck(e)) {
                        swal({ title: 'Error!', text: 'Se ha producido un error al cargar los metodos de pago', icon: 'error' });
                    }
                }
            })
        );
    }
    loadOrders(page: number | undefined, username: string | undefined): void {
        this.subscription.add(
            this.orderService.getPendingOrders(page ? page : 0, 15, username ? username : '').subscribe({
                next: (r: any) => {
                    this.orders = r.result;
                    this.currentPage = r.currentPage;
                    this.totalPages = r.totalPages;
                    this.getPagesToShow(2);
                },
                error: (e) => {
                    if (this.statusCheck(e)) {
                        swal({ title: 'Error!', text: 'Se ha producido un error al cargar tus pedidos', icon: 'error' });
                    }
                }
            })
        );
    }
    payOrder(orderId: number): void {
        this.router.navigate(['pay-order'],
            { queryParams: { 'external_reference': orderId } });
    }
    cancelOrder(orderId: number): void {
        swal({
            title: "Cancelar Pedido",
            text: "¿Seguro que quiere cancelar el pedido? Esta acción es irreversible",
            icon: "warning",
            dangerMode: true,
            buttons: {
                cancel: true,
                confirm: true,
            }
        })
            .then((cancelar: boolean) => {
                if (cancelar) {
                    this.subscription.add(
                        this.orderService.cancelOrder(orderId).subscribe({
                            next: () => {
                                this.loadOrders(this.currentPage, this.searchString);
                            },
                            error: (e) => {
                                if (this.statusCheck(e)) {
                                    swal({ title: 'Error!', text: 'Se ha producido un error al cancelar la orden', icon: 'error' });
                                }
                            }

                        })
                    );
                }
            });

    }
    updateState(): void {
        let os: OrderState = this.form.value.orderState;
        this.subscription.add(
            this.orderService.updateOrderState(this.selectedOrderId, os).subscribe({
                next: () => {
                    this.loadOrders(this.currentPage, this.searchString);
                },
                error: (e) => {
                    if (this.statusCheck(e)) {
                        swal({ title: 'Error!', text: 'Se ha producido un error al actualizar la orden', icon: 'error' });
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
}
