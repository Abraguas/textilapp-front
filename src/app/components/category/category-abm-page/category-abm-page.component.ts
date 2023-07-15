import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/models/category';
import { CategoryDTO } from 'src/app/models/category-dto';
import { SubCategory } from 'src/app/models/sub-category';
import { SubCategoryDTO } from 'src/app/models/sub-category-dto';
import { CategoryService } from 'src/app/services/category.service';
import { SessionService } from 'src/app/services/session.service';
import { SweetAlert } from 'sweetalert/typings/core';
import { Location } from '@angular/common';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
    selector: 'app-category-abm-page',
    templateUrl: './category-abm-page.component.html',
    styleUrls: ['./category-abm-page.component.css']
})
export class CategoryAbmPageComponent implements OnInit, OnDestroy {
    categoryForm: FormGroup;
    categories: CategoryDTO[];
    category: CategoryDTO;
    categoryEditingEnabled: boolean = false;

    subCategoryForm: FormGroup;
    subCategories: SubCategoryDTO[];
    subCategory: SubCategoryDTO;
    subCategoryEditingEnabled: boolean = false;

    private subscription: Subscription;
    constructor(
        private sessionService: SessionService,
        private categoryService: CategoryService,
        private router: Router,
        private formBuilder: FormBuilder,
        private location: Location,
        private route: ActivatedRoute
    ) { }
    ngOnInit(): void {
        this.subscription = new Subscription();
        this.categoryForm = this.formBuilder.group({
            name: [, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
        });
        this.subCategoryForm = this.formBuilder.group({
            name: [, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
        });
        this.loadCategories();
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    loadCategories(): void {
        this.subscription.add(
            this.categoryService.getAll().subscribe({
                next: (r: CategoryDTO[]) => {
                    this.categories = r;
                    if (this.route.snapshot.paramMap.get('id') && this.route.snapshot.paramMap.get('id') !== null) {
                        this.loadSubCategories(parseInt(this.route.snapshot.paramMap.get('id')!));
                    }
                },
                error: (e) => {
                    if (this.statusCheck(e)) {
                        swal({ title: 'Error!', text: 'Se ha producido un error al cargar las marcas', icon: 'error' });
                    }
                }
            })
        );
    }
    deleteCategory(categoryId: number): void {
        swal({
            title: "Eliminar Categoría",
            text: "¿Seguro que quiere eliminar la categoría? Esta acción es irreversible",
            icon: "warning",
            dangerMode: true,
            buttons: {
                cancel: true,
                confirm: true,
            }
        }).then((del: boolean) => {
            if (!del) { return }
            this.subscription.add(
                this.categoryService.delete(categoryId).subscribe({
                    next: () => {
                        this.loadCategories();
                        this.cancelSubCategoryEditing();
                        this.cancelCategoryEditing();
                    },
                    error: (e) => {
                        if (this.statusCheck(e)) {
                            if (e.status == 400) {
                                swal({ title: 'Error!', text: '¡Hay subcategorías en esta categoría! ¡No puedes eliminarla!', icon: 'error' });
                                return
                            }
                            swal({ title: 'Error!', text: 'Se ha producido un error al eliminar la categoría!', icon: 'error' });
                        }
                    }
                })
            )
        });
    }
    registerCategory(): void {
        this.subscription.add(
            this.categoryService.register(this.categoryForm.value as Category).subscribe({
                next: () => {
                    swal({ title: 'Listo!', text: `Categoría registrada exitosamente.`, icon: 'success' }).then(() => {
                        this.loadCategories();
                        this.categoryForm.reset();
                    });

                },
                error: (e) => {
                    if (this.statusCheck(e)) {
                        swal({ title: 'Error!', text: 'Se ha producido un error al registrar la categoria!', icon: 'error' });
                    }
                }
            })
        );
    }
    updateCategory(): void {
        this.subscription.add(
            this.categoryService.update(this.category.id, this.categoryForm.value as Category).subscribe({
                next: () => {
                    swal({ title: 'Listo!', text: `Categoría actualizada exitosamente.`, icon: 'success' }).then(() => {
                        this.loadCategories();
                        this.cancelCategoryEditing();
                    });

                },
                error: (e) => {
                    if (this.statusCheck(e)) {
                        swal({ title: 'Error!', text: 'Se ha producido un error al registrar la categoria!', icon: 'error' });
                    }
                }
            })
        );
    }
    deleteSubCategory(subCategoryId: number): void {
        swal({
            title: "Eliminar Subcategoría",
            text: "¿Seguro que quiere eliminar la categoría? Esta acción es irreversible",
            icon: "warning",
            dangerMode: true,
            buttons: {
                cancel: true,
                confirm: true,
            }
        }).then((del: boolean) => {
            if (!del) { return }
            this.subscription.add(
                this.categoryService.deleteSubCategory(subCategoryId).subscribe({
                    next: () => {
                        this.loadCategories();
                        this.cancelSubCategoryEditing();
                    },
                    error: (e) => {
                        if (this.statusCheck(e)) {
                            if (e.status == 400) {
                                swal({ title: 'Error!', text: '¡Hay productos registrados en esta subcategoría! ¡No puedes eliminarla!', icon: 'error' });
                                return
                            }
                            swal({ title: 'Error!', text: 'Se ha producido un error al eliminar la subcategoría!', icon: 'error' });
                        }
                    }
                })
            )
        });
    }
    registerSubCategory(): void {
        let subCat = this.subCategoryForm.value as SubCategory;
        subCat.category = this.category;
        this.subscription.add(
            this.categoryService.registerSubCategory(subCat).subscribe({
                next: () => {
                    swal({ title: 'Listo!', text: `Subcategoría registrada exitosamente.`, icon: 'success' }).then(() => {
                        this.loadCategories();
                        this.cancelSubCategoryEditing();
                        this.subCategoryForm.reset();
                    });

                },
                error: (e) => {
                    if (this.statusCheck(e)) {
                        swal({ title: 'Error!', text: 'Se ha producido un error al registrar la subcategoria!', icon: 'error' });
                    }
                }
            })
        );
    }
    updateSubCategory(): void {
        this.subscription.add(
            this.categoryService.updateSubCategory(this.subCategory.id, this.subCategoryForm.value as SubCategory).subscribe({
                next: () => {
                    swal({ title: 'Listo!', text: `Subcategoría actualizada exitosamente.`, icon: 'success' }).then(() => {
                        this.loadCategories();
                        this.router.navigate(['management/category', this.category.id]);
                        this.cancelSubCategoryEditing();
                    });

                },
                error: (e) => {
                    if (this.statusCheck(e)) {
                        swal({ title: 'Error!', text: 'Se ha producido un error al registrar la subcategoría!', icon: 'error' });
                    }
                }
            })
        );
    }
    selectCategoryId(categoryId: number): void {
        this.router.navigate(['management/category', categoryId]);
        this.loadCategories();
    }
    loadSubCategories(catId: number): void {
        const cat = this.categories.find(x => x.id == catId);
        if (cat) {
            this.enableCategoryEditing(cat);
        }
    }
    enableCategoryEditing(category: CategoryDTO): void {
        this.category = category;
        this.categoryForm.patchValue(category);
        this.categoryEditingEnabled = true;
    }
    cancelCategoryEditing(): void {
        this.router.navigate(['management/category']);
        this.categoryForm.reset();
        this.categoryEditingEnabled = false;
    }
    enableSubCategoryEditing(subCategory: SubCategoryDTO): void {
        this.subCategory = subCategory;
        this.subCategoryForm.patchValue(subCategory);
        this.subCategoryEditingEnabled = true;
    }
    cancelSubCategoryEditing(): void {
        this.subCategoryForm.reset();
        this.subCategoryEditingEnabled = false;
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

