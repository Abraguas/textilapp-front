import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Brand } from 'src/app/models/brand';
import { CategoryDTO } from 'src/app/models/category-dto';
import { Color } from 'src/app/models/color';
import { Product } from 'src/app/models/product';
import { SubCategoryDTO } from 'src/app/models/sub-category-dto';
import { Unit } from 'src/app/models/unit';
import { AuxiliarService } from 'src/app/services/auxiliar.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SessionService } from 'src/app/services/session.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
    selector: 'app-register-product',
    templateUrl: './register-product.component.html',
    styleUrls: ['./register-product.component.css']
})
export class RegisterProductComponent implements OnInit, OnDestroy {
    form: FormGroup;
    brands: Brand[];
    units: Unit[];
    colors: Color[];
    categories: CategoryDTO[];
    subCategories: SubCategoryDTO[];
    private subscription = new Subscription();
    product: Product;
    constructor(
        private formBuilder: FormBuilder,
        private productService: ProductService,
        private auxiliarService: AuxiliarService,
        private router: Router,
        private sessionService: SessionService,
        private categoryService: CategoryService
    ) {
        this.form = this.formBuilder.group(
            {
                name: [, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
                description: [, [Validators.maxLength(300)]],
                brand: [, [Validators.required]],
                pricePerUnit: [, [Validators.required, Validators.min(1)]],
                unit: [, [Validators.required]],
                observations: [, [Validators.maxLength(300)]],
                measurment: [, [Validators.maxLength(30)]],
                color: [, [Validators.required]],
                category: [, [Validators.required]],
                subCategory: [, [Validators.required]],
                image: [,],
                isListed: [,],
            }
        );
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    ngOnInit(): void {
        this.subscription.add(
            this.form.valueChanges.subscribe(
                val => {
                    this.product = val as Product;
                }
            )
        )
        this.loadCategories();
        this.loadBrands();
        this.loadColors();
        this.loadUnits();
        this.subscription.add(
            this.form.controls['category'].valueChanges.subscribe(
                val => {
                    this.subCategories = val.subCategories as SubCategoryDTO[];
                }
            )
        )
    }
    loadCategories(): void {
        this.subscription.add(
            this.categoryService.getAll().subscribe({
                next: (r: CategoryDTO[]) => {
                    this.categories = r;
                },
                error: (e) => {
                    this.statusCheck(e);
                }
            })
        )
    }
    loadBrands(): void {
        this.subscription.add(
            this.auxiliarService.getBrands().subscribe({
                next: (r: Brand[]) => {
                    this.brands = r;
                },
                error: (e) => {
                    this.statusCheck(e);
                }
            })
        )
    }
    loadColors(): void {
        this.subscription.add(
            this.auxiliarService.getColors().subscribe({
                next: (r: Color[]) => {
                    this.colors = r;
                },
                error: (e) => {
                    this.statusCheck(e);
                }
            })
        )

    }
    loadUnits(): void {
        this.subscription.add(
            this.auxiliarService.getUnits().subscribe({
                next: (r: Unit[]) => {
                    this.units = r;
                },
                error: (e) => {
                    this.statusCheck(e);
                }
            })
        )
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
        console.error(e);
        return true;
    }

    save(): void {
        delete this.form.value.category;
        this.product = this.form.value;
        this.product.stock = 0;
        this.subscription.add(
            this.productService.save(this.product).subscribe({
                next: () => {
                    swal({ title: 'Listo!', text: `Producto registrado exitosamente.`, icon: 'success' }).then(() => {
                        this.router.navigate(["/management/product/list"]);
                    });
                },
                error: (e) => {
                    if (this.statusCheck(e)) {
                        swal({ title: 'Error!', text: 'Se ha producido un error al registrar el producto', icon: 'error' })
                    }
                }
            })
        )
    }
}
