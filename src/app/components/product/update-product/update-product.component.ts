import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, first } from 'rxjs';
import { Brand } from 'src/app/models/brand';
import { CategoryDTO } from 'src/app/models/category-dto';
import { Color } from 'src/app/models/color';
import { Product } from 'src/app/models/product';
import { SubCategoryDTO } from 'src/app/models/sub-category-dto';
import { Unit } from 'src/app/models/unit';
import { AuxiliarService } from 'src/app/services/auxiliar.service';
import { CategoryService } from 'src/app/services/category.service';
import { ImageService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';
import { SessionService } from 'src/app/services/session.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
    selector: 'app-update-product',
    templateUrl: './update-product.component.html',
    styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent {
    form: FormGroup;
    fileForm: FormGroup;
    brands: Brand[];
    units: Unit[];
    colors: Color[];
    categories: CategoryDTO[];
    subCategories: SubCategoryDTO[];
    private subscription = new Subscription();
    product: Product;
    productId: number;
    editingEnabled: boolean = false;
    imagePreview: any;
    imageName: string;

    constructor(
        private formBuilder: FormBuilder,
        private productService: ProductService,
        private auxiliarService: AuxiliarService,
        private router: Router,
        private route: ActivatedRoute,
        private sessionService: SessionService,
        private categoryService: CategoryService,
        private imageService: ImageService
    ) {
        this.form = this.formBuilder.group(
            {
                name: [{ value: "", disabled: true }, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
                description: [{ value: "", disabled: true }, [Validators.maxLength(255)]],
                brand: [{ value: "", disabled: true }, [Validators.required]],
                pricePerUnit: [{ value: "", disabled: true }, [Validators.required, Validators.min(1)]],
                unit: [{ value: "", disabled: true }, [Validators.required]],
                observations: [{ value: "", disabled: true }, [Validators.maxLength(255)]],
                measurment: [{ value: "", disabled: true }, [Validators.maxLength(255)]],
                color: [{ value: "", disabled: true }, [Validators.required]],
                category: [{ value: "", disabled: true }, [Validators.required]],
                subCategory: [{ value: "", disabled: true }, [Validators.required]],
                image: [{ value: "", disabled: true },],
                isListed: [{ value: "", disabled: true },],
            }
        );
        this.fileForm = this.formBuilder.group({
            image: [{ value: "", disabled: true },]
        })

    }
    onFileSelected(event: any) {
        if (event.target.files && event.target.files.length > 0) {
            const reader = new FileReader();
            let self = this;
            reader.onload = function (event) {
                self.imagePreview = event.target ? event.target.result : '';
            };
            const file: File = event.target.files[0];
            reader.readAsDataURL(file);
            this.fileForm.get('image')!.setValue(file);
        }
    }

    save(): void {
        const file = this.fileForm.get('image')!.value;
        if (typeof file === 'string') {
            this.uploadProduct();
        }
        this.subscription.add(
            this.imageService.save(file).subscribe({
                next: (r) => {
                    this.imageName = r.message;
                    this.uploadProduct();
                },
                error: (e) => {
                    this.statusCheck(e);
                }
            })
        );
    }
    compareFn(c1: any, c2: any): boolean {
        return c1 && c2 && (c1.id === c2.id || c2 === c1.id);
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

    }
    loadProduct(): void {
        this.subscription.add(
            this.productService.getById(this.productId).subscribe({
                next: (r: Product) => {
                    this.product = r;
                    const catDTO = this.categories.filter((c) => {
                        return c.id === this.product.subCategory.category.id
                    })
                    const subCatDTO = {
                        id: this.product.subCategory.id,
                        name: this.product.subCategory.name
                    }
                    this.form.patchValue({
                        ...this.product,
                        ...{
                            category: catDTO[0],
                            subCategory: subCatDTO
                        }
                    });
                    this.fileForm.get('image')!.patchValue(this.product.image);
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
    loadCategories(): void {
        this.subscription.add(
            this.categoryService.getAll().subscribe({
                next: (r) => {
                    this.categories = r as CategoryDTO[];
                    this.subscription.add(
                        this.form.controls['category'].valueChanges.subscribe(
                            val => {
                                this.subCategories = val.subCategories as SubCategoryDTO[];
                            }
                        )
                    );
                    this.route.params
                        .pipe(first())
                        .subscribe(params => {
                            this.productId = params['id'];
                            this.loadProduct();
                        });
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
        if (e.status === 0) {
            swal({ title: 'El servidor se encuentra caido!', text: 'Intenta denuevo más tarde, lamentamos el inconveniente', icon: 'error' }).then(() => {
                this.sessionService.logout();
                return false;
            });
        }
        console.error(e);
        return true;
    }
    toggleEditing(): void {
        if (this.editingEnabled) {
            Object.keys(this.form.controls).forEach((c) => {
                this.form.controls[c].disable();
            });
            Object.keys(this.fileForm.controls).forEach((c) => {
                this.fileForm.controls[c].disable();
            });
            this.loadProduct();
        } else {
            Object.keys(this.form.controls).forEach((c) => {
                this.form.controls[c].enable();
            });
            Object.keys(this.fileForm.controls).forEach((c) => {
                this.fileForm.controls[c].enable();
            });
        }
        this.editingEnabled = !this.editingEnabled;
    }
    uploadProduct(): void {
        delete this.form.value.category;
        this.product = this.form.value;
        this.product.stock = 0;
        this.product.image = this.imageName;
        this.subscription.add(
            this.productService.update(this.product, this.productId).subscribe({
                next: () => {
                    swal({ title: 'Listo!', text: `Producto actualizado exitosamente.`, icon: 'success' }).then(() => {
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
    return(): void {
        this.router.navigate(["/management/product/list"]);
    }
}
