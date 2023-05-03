import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GetOrderDTO } from 'src/app/models/get-order-dto';
import { OrderService } from 'src/app/services/order.service';
import { SessionService } from 'src/app/services/session.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
    selector: 'app-my-orders-page',
    templateUrl: './my-orders-page.component.html',
    styleUrls: ['./my-orders-page.component.css']
})
export class MyOrdersPageComponent {
    orders: GetOrderDTO[];
    subscription: Subscription;
    constructor(
        private orderService: OrderService,
        private sessionService: SessionService,
        private router: Router
    ) { }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    ngOnInit(): void {
        this.subscription = new Subscription();
        this.loadOrders();
    }
    loadOrders(): void {
        this.subscription.add(
            this.orderService.getMyOrders().subscribe({
                next: (r: GetOrderDTO[]) => {
                    this.orders = r;
                },
                error: (e) => {
                    if (this.statusCheck(e)) {
                        swal({ title: 'Error!', text: 'Se ha producido un error al cargar tus pedidos', icon: 'error' });
                    }
                }
            })
        );
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
            .then((cerrarSesion: boolean) => {
                if (cerrarSesion) {
                    this.subscription.add(
                        this.orderService.cancelOrder(orderId).subscribe({
                            next: () => {
                                this.loadOrders();
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
