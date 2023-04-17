import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderDetailDTO } from 'src/app/models/order-detail-dto';
import { OrderDTO } from 'src/app/models/order-dto';
import { Product } from 'src/app/models/product';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { SessionService } from 'src/app/services/session.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
    selector: 'app-product-catalog',
    templateUrl: './product-catalog.component.html',
    styleUrls: ['./product-catalog.component.css']
})
export class ProductCatalogComponent implements OnInit, OnDestroy {
    totalPrice: number = 0;
    totalQuantity: number = 0;
    subCategory: number;
    products: Product[];
    subscription: Subscription;
    order: OrderDTO;
    observationsControl = new FormControl('');

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private productService: ProductService,
        private orderService: OrderService,
        private sessionService: SessionService
    ) { }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngOnInit(): void {
        this.subscription = new Subscription();
        this.getSubCategory();
        this.order = new OrderDTO();
        this.order.details = [];

    }
    getSubCategory(): void {
        this.subscription.add(
            this.route.params.subscribe(params => {

                this.subCategory = params["subCategory"];
                this.loadProducts();
            })
        );
    }
    addDetail(detail: OrderDetailDTO): void {
        this.order.details.push(detail);
        this.getTotal();
        this.getTotalQuantity();
    }
    removeDetail(detail: OrderDetailDTO): void {
        let i = this.order.details.indexOf(detail);
        this.order.details.splice(i, 1);
        this.getTotal();
        this.getTotalQuantity();
    }
    loadProducts(): void {
        if (this.subCategory < 1 || !this.subCategory) {
            this.subscription.add(
                this.productService.getAll().subscribe({
                    next: (r: Product[]) => {
                        this.products = r;
                        return;
                    },
                    error: (e) => {
                        if (e.status === 403) {
                            swal({ title: 'Error!', text: 'No tienes permitido el acceso a esta pagina!', icon: 'error' }).then(() => {
                                this.router.navigate(['home']);
                                return;
                            });
                        }
                        if (e.status === 401) {
                            swal({ title: 'Tu sesión ha expirado!', text: '', icon: 'error' }).then(() => {
                                this.sessionService.logout();
                                return;
                            });
                        }
                        console.error(e);
                        return;
                    }
                })
            );
        } else {
            this.subscription.add(
                this.productService.getBySubcategory(this.subCategory).subscribe({
                    next: (r: Product[]) => {
                        this.products = r;
                    },
                    error: (e) => {
                        console.error(e);
                    }
                })
            );
        }

    }
    getTotal(): void {
        let total = 0;
        this.order.details.forEach(x => {
            total = total + x.pricePerUnit * x.quantity;
        });
        this.totalPrice = total;
    }

    getTotalQuantity(): void {
        let total = 0;
        this.order.details.forEach(x => {
            total = total + 1;
        })
        this.totalQuantity = total;
    }
    isAdded(p: Product): boolean {
        let cond = this.order.details.find(x => x.product.id === p.id);
        if (cond) {
            return true;
        }
        return false;
    }
    save(): void {
        this.order.observations = this.observationsControl.value ? this.observationsControl.value : "";
        this.subscription.add(
            this.orderService.save(this.order).subscribe({
                next: () => {
                    swal({ title: 'Listo!', text: 'Registraste tu pedido con éxito.', icon: 'success' }).then(() => {
                        this.router.navigate(['home']);
                    });
                },
                error: (e) => {
                    if (e.status === 403) {
                        swal({ title: 'Error!', text: 'No tienes permitido el acceso a esta pagina!', icon: 'error' }).then(() => {
                            this.router.navigate(['home']);
                            return;
                        });
                    }
                    if (e.status === 401) {
                        swal({ title: 'Error!', text: 'Tu sesión ha expirado!', icon: 'error' }).then(() => {
                            this.sessionService.logout();
                            return;
                        });
                    }
                    else {
                        swal({ title: 'Error!', text: 'Ocurrió un error', icon: 'error' });
                        console.error(e);
                    }
                }
            })
        )
    }
}
