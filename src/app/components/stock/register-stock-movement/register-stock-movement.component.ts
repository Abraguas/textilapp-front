import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { StockMovement } from 'src/app/models/stock-movement';
import { ProductService } from 'src/app/services/product.service';
import { SessionService } from 'src/app/services/session.service';
import { StockMovementService } from 'src/app/services/stock-movement.service';
import { SweetAlert } from 'sweetalert/typings/core';
import { stockQuantityValidator } from 'src/app/validators/stock-quantity.validator';

declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
    selector: 'app-register-stock-movement',
    templateUrl: './register-stock-movement.component.html',
    styleUrls: ['./register-stock-movement.component.css']
})
export class RegisterStockMovementComponent implements OnInit, OnDestroy {
    Math: any = Math;
    form: FormGroup;
    defaultRoute: string = "../../assets/img/default-item.jpg";
    products: Product[];
    selectedProduct: Product | undefined;
    stockMovements: StockMovement[] = [];
    subscription: Subscription;
    onImgError(event: any): void {
        event.target.src = this.defaultRoute;
    }
    constructor(
        private stockMovementService: StockMovementService,
        private formBuilder: FormBuilder,
        private productService: ProductService,
        private sessionService: SessionService,
        private router: Router
    ) {
        this.form = this.formBuilder.group(
            {
                observations: [, []],
                quantity: [, [Validators.min(1), Validators.required]],
                isIncome: [, []],
                product: [, []]

            }
        );
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    ngOnInit(): void {
        this.subscription = new Subscription();
        this.subscription.add(
            this.form.controls['isIncome'].valueChanges.subscribe((isIncome) => {
                this.updateQuantityValidators(isIncome, this.selectedProduct?.stock);
            })
        );
        this.loadProducts();
    }
    updateQuantityValidators(isIncome: boolean, prodStock: number | undefined): void {
        this.form.controls['quantity'].setValidators([
            Validators.min(1), Validators.required,
            stockQuantityValidator(prodStock, isIncome)
        ]);
        this.form.controls['quantity'].updateValueAndValidity();
    }
    loadProducts() {
        this.subscription.add(
            this.productService.getAll("").subscribe({
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
    registerMovements(): void {
        if (this.stockMovements.length < 1) {
            return;
        }
        this.subscription.add(
            this.stockMovementService.registerAll(this.stockMovements).subscribe({
                next: () => {
                    swal({ title: 'Listo!', text: `Movimientos registrados exitosamente.`, icon: 'success' }).then(() => {
                        this.loadProducts();
                        this.selectedProduct = undefined;
                        this.stockMovements = [];
                        this.form.reset();
                    });

                },
                error: (e) => {
                    if (this.statusCheck(e)) {
                        swal({ title: 'Error!', text: 'Se ha producido un error al registrar los movimientos', icon: 'error' })
                    }
                }
            })
        );
    }
    addMovement(): void {
        let mv = this.form.value;
        if (!mv.isIncome) {
            mv.quantity = mv.quantity * -1;
        }
        mv.product = this.selectedProduct;
        delete mv.isIncome;
        this.stockMovements.push(mv);
        this.form.reset();
        this.selectedProduct = undefined;
    }
    removeMovement(sm: StockMovement): void {
        let i = this.stockMovements.indexOf(sm);
        this.stockMovements.splice(i, 1);
    }
    selectProduct(p: Product) {
        this.selectedProduct = p;
        this.updateQuantityValidators(this.form.value.isIncome, p.stock);
    }
    isAdded(p: Product): boolean {
        let cond = this.stockMovements.find(x => x.product.id === p.id);
        if (cond) {
            return true;
        }
        return false;
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
