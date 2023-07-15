import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, first } from 'rxjs';
import { GetOrderDTO } from 'src/app/models/get-order-dto';
import { OrderDetailDTO } from 'src/app/models/order-detail-dto';
import { OrderService } from 'src/app/services/order.service';
import { PaymentService } from 'src/app/services/payment.service';
import { SessionService } from 'src/app/services/session.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');
declare var MercadoPago: any;
declare var window: any;

@Component({
    selector: 'app-pay-order-page',
    templateUrl: './pay-order-page.component.html',
    styleUrls: ['./pay-order-page.component.css']
})
export class PayOrderPageComponent implements OnInit {
    mp: any;
    bricksBuilder: any;
    brickLoaded: boolean = false;
    orderId: number;
    order: GetOrderDTO;
    totalPrice: number = 0;
    defaultRoute: string = "../../assets/img/default-item.jpg";
    private subscription = new Subscription();
    constructor(
        private route: ActivatedRoute,
        private paymentService: PaymentService,
        private orderService: OrderService,
        private router: Router,
        private sessionService: SessionService
    ) {
        this.mp = new MercadoPago('APP_USR-dfe0ebe1-55fd-4e4f-9966-4271e7c90a55');
        this.bricksBuilder = this.mp.bricks();

    }

    onImgError(event: any): void {
        event.target.src = this.defaultRoute;
    }
    loadOrder(): void {
        this.subscription.add(
            this.orderService.getById(this.orderId).subscribe({
                next: (r: GetOrderDTO) => {
                    this.order = r;
                    this.order.details.forEach((d: OrderDetailDTO) => {
                        this.totalPrice += d.pricePerUnit * d.quantity;
                    });
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
    ngOnInit(): void {
        this.subscription.add(
            this.route.queryParams.subscribe(params => {
                this.orderId = parseInt(params['external_reference']);
                this.loadOrder();
                if (params['payment_id'] && params['payment_id'] !== 'null') {
                    if (params['status'] !== 'null') {
                        this.subscription.add(
                            this.paymentService.getPaymentState(parseInt(params['payment_id'])).subscribe({
                                next: (r: any) => {
                                    if (r.approved) {
                                        swal({ title: 'Listo!', text: `Se registró tu pago exitosamente.`, icon: 'success' }).then(() => {
                                            this.router.navigate(["/my-orders"]);
                                        });
                                        return;
                                    }
                                    swal({ title: 'Error!', text: "No se registó ningun pago! Puedes intentarlo de nuevo o cancelar el pedido desde 'Mis Pedidos'", icon: 'error' })

                                },
                                error: (e) => {
                                    if (this.statusCheck(e)) {
                                        swal({ title: 'Error!', text: 'Se ha producido un error validando el pago', icon: 'error' })

                                    }
                                    console.log(e);
                                }
                            })
                        );

                    } else {
                        console.error("No se pagó la orden");
                    }
                }
            })
        );
        this.renderPaymentBrick(this.bricksBuilder);
    }
    async renderPaymentBrick(bricksBuilder: any) {
        const settings = {
            locale: 'es',
            callbacks: {
                onReady: () => {
                    this.brickLoaded = true;
                },
                onSubmit: (formData: any) => {
                    // callback called when clicking Wallet Brick
                    // this is possible because the brick is a button
                    // at this time of submit, you must create the preference

                    return new Promise((resolve, reject) => {
                        fetch('http://localhost:9090/payment/' + this.orderId, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            },
                            body: JSON.stringify(formData),
                        })
                            .then((response) => response.json())
                            .then((response) => {
                                // resolve the promise with the ID of the preference
                                resolve(response.id);
                            })
                            .catch((error) => {
                                // handle error response when trying to create preference
                                alert("ERROR DESCONOCIDO")
                                reject();
                            });
                    });
                },
            },
        };
        window.walletBrickController = await bricksBuilder.create(
            'wallet',
            'walletBrick_container',
            settings,
        );

    };
}
