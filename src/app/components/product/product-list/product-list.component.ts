import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { SessionService } from 'src/app/services/session.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
    defaultRoute: string = "../../assets/img/default-item.jpg";
    products: Product[];
    subscription: Subscription;
    onImgError(event: any): void {
        event.target.src = this.defaultRoute;
    }
    constructor(
        private productService: ProductService,
        private sessionService: SessionService,
        private router: Router
    ) { }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    ngOnInit(): void {
        this.subscription = new Subscription();
        this.loadProducts();
    }
    loadProducts() {
        this.subscription.add(
            this.productService.getAll().subscribe({
                next: (r: Product[]) => {
                    this.products = r;
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
    }
    unlist(productId: number): void {
        this.subscription.add(
            this.productService.unlist(productId).subscribe({
                next: () => {
                    this.loadProducts();
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
    }
    list(productId: number): void {
        this.subscription.add(
            this.productService.list(productId).subscribe({
                next: () => {
                    this.loadProducts();
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
    }
}
