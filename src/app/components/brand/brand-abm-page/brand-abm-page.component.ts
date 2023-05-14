import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Brand } from 'src/app/models/brand';
import { AuxiliarService } from 'src/app/services/auxiliar.service';
import { SessionService } from 'src/app/services/session.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
    selector: 'app-brand-abm-page',
    templateUrl: './brand-abm-page.component.html',
    styleUrls: ['./brand-abm-page.component.css']
})
export class BrandAbmPageComponent implements OnInit, OnDestroy {
    form: FormGroup;
    brands: Brand[];
    brand: Brand;
    editingEnabled: boolean = false;
    private subscription: Subscription;
    constructor(
        private sessionService: SessionService,
        private auxiliarService: AuxiliarService,
        private router: Router,
        private formBuilder: FormBuilder
    ) { }
    ngOnInit(): void {
        this.subscription = new Subscription();
        this.form = this.formBuilder.group({
            name: [, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
        });
        this.loadBrands();
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    loadBrands(): void {
        this.subscription.add(
            this.auxiliarService.getBrands().subscribe({
                next: (r: Brand[]) => {
                    this.brands = r;
                },
                error: (e) => {
                    if (this.statusCheck(e)) {
                        swal({ title: 'Error!', text: 'Se ha producido un error al cargar las marcas', icon: 'error' });
                    }
                }
            })
        );
    }
    deleteBrand(brandId: number): void {
        swal({
            title: "Eliminar Marca",
            text: "¿Seguro que quiere eliminar la marca? Esta acción es irreversible",
            icon: "warning",
            dangerMode: true,
            buttons: {
                cancel: true,
                confirm: true,
            }
        }).then((del: boolean) => {
            if (!del) { return }
            this.subscription.add(
                this.auxiliarService.deleteBrand(brandId).subscribe({
                    next: () => {
                        this.loadBrands();
                    },
                    error: (e) => {
                        if (this.statusCheck(e)) {
                            if (e.status == 400) {
                                swal({ title: 'Error!', text: '¡Ya hay productos registrados para esta marca! ¡No puedes eliminarla!', icon: 'error' });
                                return
                            }
                            swal({ title: 'Error!', text: 'Se ha producido un error al eliminar la marca!', icon: 'error' });
                        }
                    }
                })
            )
        });
    }
    registerBrand(): void {
        this.subscription.add(
            this.auxiliarService.registerBrand(this.form.value as Brand).subscribe({
                next: () => {
                    swal({ title: 'Listo!', text: `Marca registrada exitosamente.`, icon: 'success' }).then(() => {
                        this.loadBrands();
                        this.form.reset();
                    });

                },
                error: (e) => {
                    if (this.statusCheck(e)) {
                        swal({ title: 'Error!', text: 'Se ha producido un error al registrar la marca!', icon: 'error' });
                    }
                }
            })
        );
    }
    updateBrand(): void {
        this.subscription.add(
            this.auxiliarService.updateBrand(this.brand.id, this.form.value as Brand).subscribe({
                next: () => {
                    swal({ title: 'Listo!', text: `Marca actualizada exitosamente.`, icon: 'success' }).then(() => {
                        this.loadBrands();
                        this.cancelEditing();
                    });

                },
                error: (e) => {
                    if (this.statusCheck(e)) {
                        swal({ title: 'Error!', text: 'Se ha producido un error al registrar la marca!', icon: 'error' });
                    }
                }
            })
        );
    }
    enableEditing(brand: Brand): void {
        this.brand = brand;
        this.form.patchValue(brand);
        this.editingEnabled = true;
    }
    cancelEditing(): void {
        this.form.reset();
        this.editingEnabled = false;
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
