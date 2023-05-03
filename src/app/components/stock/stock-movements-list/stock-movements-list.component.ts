import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, first } from 'rxjs';
import { Product } from 'src/app/models/product';
import { StockMovement } from 'src/app/models/stock-movement';
import { StockMovementDTO } from 'src/app/models/stock-movement-dto';
import { ProductService } from 'src/app/services/product.service';
import { SessionService } from 'src/app/services/session.service';
import { StockMovementService } from 'src/app/services/stock-movement.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
    selector: 'app-stock-movements-list',
    templateUrl: './stock-movements-list.component.html',
    styleUrls: ['./stock-movements-list.component.css']
})
export class StockMovementsListComponent implements OnInit, OnDestroy {
    private subscription = new Subscription();
    stockMovements: StockMovementDTO[];
    form: FormGroup
    product: Product;
    productId: number;
    Math: any = Math;
    constructor(
        private stockMovementService: StockMovementService,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private sessionService: SessionService,
        private productService: ProductService
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
        this.route.params
            .pipe(first())
            .subscribe(params => {
                if (params['id']) {
                    this.productId = parseInt(params['id']);
                    this.loadMovements(this.productId);
                    this.loadProduct();
                }
            });
    }
    loadMovements(productId: number): void {
        this.subscription.add(
            this.stockMovementService.getMovementsByProductId(productId).subscribe({
                next: (r: StockMovementDTO[]) => {
                    this.stockMovements = r;
                },
                error: (e) => {
                    this.statusCheck(e);
                }
            })
        );
    }
    loadProduct(): void {
        this.subscription.add(
            this.productService.getById(this.productId).subscribe({
                next: (r: Product) => {
                    this.product = r;
                    this.form.controls['product'].setValue(r);
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
    save(): void {

        let mv = this.form.value;
        if (!mv.isIncome) {
            mv.quantity = mv.quantity * -1;
        }
        mv.product = this.product
        delete mv.isIncome;
        if (this.form.valid) {
            this.subscription.add(
                this.stockMovementService.register(mv).subscribe({
                    next: () => {
                        swal({ title: 'Listo!', text: `Movimiento registrado exitosamente.`, icon: 'success' }).then(() => {
                            this.loadMovements(this.productId);
                            this.form.reset();
                        });

                    },
                    error: (e) => {
                        if (this.statusCheck(e)) {
                            swal({ title: 'Error!', text: 'Se ha producido un error al registrar el movimiento', icon: 'error' })
                        }
                    }
                })
            );
        }
    }
}
