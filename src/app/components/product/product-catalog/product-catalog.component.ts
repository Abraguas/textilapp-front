import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
    queryParams: Params;
    totalPrice: number = 0;
    totalQuantity: number = 0;
    subCategory: number;
    products: Product[];
    filteredProducts: Product[];
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
        this.getQueryParams();
        this.order = new OrderDTO();
        this.order.details = [];
        this.loadProducts();

    }
    getQueryParams(): void {
        this.subscription.add(
            this.route.queryParams.subscribe(params => {
                this.queryParams = params;
                if (this.subCategory != params["subCategory"]) {
                    this.subCategory = params["subCategory"];
                    this.loadProducts();
                } else {

                    this.filterProducts();
                }
            })
        );
    }
    filterProducts(): void {
        this.filterProductsByBrand();
        this.filterProductsByColor();
        this.filterProductsByUnit();
    }
    filterProductsByBrand(): void {
        let brandIds = this.queryParams['brand'];
        if (!Array.isArray(brandIds) && brandIds) {
            this.filteredProducts = this.products.filter((p: Product) => {
                return brandIds === p.brand.id.toString();
            })
            return;
        }
        if (!brandIds || brandIds.length === 0) {
            this.filteredProducts = this.products
            return;
        }
        this.filteredProducts = this.products.filter((p: Product) => {
            return brandIds.includes(p.brand.id.toString());
        })
    }
    filterProductsByColor(): void {
        let colorIds = this.queryParams['color'];
        if (!Array.isArray(colorIds) && colorIds) {
            this.filteredProducts = this.filteredProducts.filter((p: Product) => {
                return colorIds === p.color.id.toString();
            })
            return;
        }
        if (!colorIds || colorIds.length === 0) {
            this.filteredProducts = this.filteredProducts
            return;
        }
        this.filteredProducts = this.filteredProducts.filter((p: Product) => {
            return colorIds.includes(p.color.id.toString());
        })
    }
    filterProductsByUnit(): void {
        let unitIds = this.queryParams['unit'];
        if (!Array.isArray(unitIds) && unitIds) {
            this.filteredProducts = this.filteredProducts.filter((p: Product) => {
                return unitIds === p.unit.id.toString();
            })
            return;
        }
        if (!unitIds || unitIds.length === 0) {
            this.filteredProducts = this.filteredProducts
            return;
        }
        this.filteredProducts = this.filteredProducts.filter((p: Product) => {
            return unitIds.includes(p.unit.id.toString());
        })
    }
    loadProducts(): void {
        if (this.subCategory < 1 || !this.subCategory) {
            this.subscription.add(
                this.productService.getAllListed().subscribe({
                    next: (r: Product[]) => {
                        this.products = r;
                        this.filteredProducts = r;
                        this.filterProducts();
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
                this.productService.getListedBySubcategory(this.subCategory).subscribe({
                    next: (r: Product[]) => {
                        this.products = r;
                        this.filteredProducts = r;
                        this.filterProducts();
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
    isAdded(p: Product): boolean {
        let cond = this.order.details.find(x => x.product.id === p.id);
        if (cond) {
            return true;
        }
        return false;
    }
    confirmSave(): void {
        swal({
            title: "Registrar Pedido",
            text: "¿Desea registrar el pedido y proceder a pagar?",
            icon: "info",
            dangerMode: false,
            buttons: {
                cancel: true,
                confirm: true,
            }
        }).then((save: boolean) => {
            if (save) {
                this.saveOrder();
            }
        })
    }
    saveOrder(): void {

        this.order.observations = this.observationsControl.value ? this.observationsControl.value : "";
        this.subscription.add(
            this.orderService.save(this.order).subscribe({
                next: (r) => {
                    this.router.navigate(['pay-order'],
                        { queryParams: { 'external_reference': r } });
                },
                error: (e) => {
                    if (e.status === 403) {
                        swal({ title: 'Error!', text: 'No tienes permitido el acceso a esta pagina!', icon: 'error' }).then(() => {
                            this.router.navigate(['home']);
                        });
                        return;
                    }
                    if (e.status === 401) {
                        swal({ title: 'Error!', text: 'Tu sesión ha expirado!', icon: 'error' }).then(() => {
                            this.sessionService.logout();
                        });
                        return;
                    }
                    if (e.status === 422) {
                        swal({ title: 'Error!', text: 'No hay suficiente stock', icon: 'error' }).then(() => {
                        });
                        return;
                    }
                    swal({ title: 'Error!', text: 'Ocurrió un error', icon: 'error' });
                    console.error(e);

                }
            })
        )
    }
}
