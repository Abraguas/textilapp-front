import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, first } from 'rxjs';
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
    nameForm: FormGroup;
    searchString: string;
    onImgError(event: any): void {
        event.target.src = this.defaultRoute;
    }
    constructor(
        private productService: ProductService,
        private sessionService: SessionService,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder
    ) {
        this.nameForm = this.formBuilder.group({
            name: [,]
        });
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    ngOnInit(): void {
        this.subscription = new Subscription();
        this.subscription.add(
            this.route.queryParams.subscribe((params) => {
                this.loadProducts(params['searchString']);
            })
        );
        this.route.queryParams
            .pipe(first())
            .subscribe(params => {
                this.nameForm.patchValue({
                    name: params['searchString'] ? params['searchString'] : ''
                });
            });
        this.subscription.add(
            this.nameForm.controls['name'].valueChanges.subscribe((value) => {
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
    loadProducts(name: string | undefined) {
        this.subscription.add(
            this.productService.getAll(name ? name : '').subscribe({
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
                    this.loadProducts(this.searchString);
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
                    this.loadProducts(this.searchString);
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
