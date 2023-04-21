import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, first } from 'rxjs';
import { Brand } from 'src/app/models/brand';
import { CategoryDTO } from 'src/app/models/category-dto';
import { Color } from 'src/app/models/color';
import { Unit } from 'src/app/models/unit';
import { AuxiliarService } from 'src/app/services/auxiliar.service';
import { CategoryService } from 'src/app/services/category.service';
import { SessionService } from 'src/app/services/session.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
    selector: 'app-store-sidebar',
    templateUrl: './store-sidebar.component.html',
    styleUrls: ['./store-sidebar.component.css']
})
export class StoreSidebarComponent implements OnInit, OnDestroy {
    subcategory: number;
    categories: CategoryDTO[];
    queryParams: Params = {
        subCategory: 0,
        brand: [],
        color: [],
        unit: []
    };
    brands: Brand[];
    units: Unit[];
    colors: Color[];
    brandForm: FormGroup;
    unitForm: FormGroup;
    colorForm: FormGroup;
    private subscription: Subscription;

    constructor(
        private categoryService: CategoryService,
        private router: Router,
        private route: ActivatedRoute,
        private auxiliarService: AuxiliarService,
        private sessionService: SessionService,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngOnInit(): void {
        this.subscription = new Subscription;
        this.route.queryParams
            .pipe(first())
            .subscribe(params => {
                this.queryParams = {
                    ...this.queryParams,
                    ...params
                };
                this.subcategory = this.queryParams['subCategory'];
                this.loadCategories();
                this.loadUnits();
                this.loadBrands();
                this.loadColors();
            });

    }
    initBrandForm(): void {
        // BRANDS
        const brandControls: any = {};
        console.log(this.queryParams);
        this.brands.forEach(brand => {
            if (this.queryParams['brand'].includes(brand.id.toString())) {
                brandControls[brand.id] = new FormControl(true);
            } else {
                brandControls[brand.id] = new FormControl(false);
            }
        });
        this.brandForm = this.formBuilder.group(brandControls);
        this.brandForm.valueChanges.subscribe(() => {
            this.addQueryParams();
        })
    }
    initColorForm(): void {
        // COLORS
        const colorControls: any = {};
        this.colors.forEach(color => {
            if (this.queryParams['color'].includes(color.id.toString())) {
                colorControls[color.id] = new FormControl(true);
            } else {
                colorControls[color.id] = new FormControl(false);
            }
        });
        this.colorForm = this.formBuilder.group(colorControls);
        this.colorForm.valueChanges.subscribe(() => {
            this.addQueryParams();
        })
    }
    initUnitForm(): void {
        // UNITS
        const unitControls: any = {};
        this.units.forEach(unit => {
            if (this.queryParams['unit'].includes(unit.id.toString())) {
                unitControls[unit.id] = new FormControl(true);
            } else {
                unitControls[unit.id] = new FormControl(false);
            }
        });
        this.unitForm = this.formBuilder.group(unitControls);
        this.unitForm.valueChanges.subscribe(() => {
            this.addQueryParams();
        })
    }
    changeSubcategory(id: number): void {
        this.subcategory = id;
        this.addQueryParams();
    }
    addQueryParams(): void {
        let brandParams = Object.entries(this.brandForm.value).filter((a) => {
            return a[1];
        }).map((z) => z[0]);
        this.queryParams['brand'] = brandParams;

        let colorParams = Object.entries(this.colorForm.value).filter((a) => {
            return a[1];
        }).map((z) => z[0]);
        this.queryParams['color'] = colorParams;

        let unitParams = Object.entries(this.unitForm.value).filter((a) => {
            return a[1];
        }).map((z) => z[0]);
        this.queryParams['unit'] = unitParams;


        this.queryParams['subCategory'] = this.subcategory;
        this.router.navigate(
            [

            ],
            {
                relativeTo: this.route,
                queryParams: this.queryParams,
                queryParamsHandling: 'merge'
            });
    }
    loadBrands(): void {
        this.subscription.add(
            this.auxiliarService.getBrands().subscribe({
                next: (r: Brand[]) => {
                    this.brands = r;
                    this.initBrandForm();
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
                    this.initColorForm();
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
                    this.initUnitForm();
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
                return false;
            });
        }
        if (e.status === 401) {
            swal({ title: 'Tu sesión ha expirado!', text: '', icon: 'error' }).then(() => {
                this.sessionService.logout();
                return false;
            });
        }
        console.error(e);
        return true;
    }

    loadCategories(): void {
        this.subscription.add(
            this.categoryService.getAll().subscribe({
                next: (r: CategoryDTO[]) => {
                    this.categories = r;
                },
                error: (e) => {
                    console.error(e);
                }
            })
        )
    }


}
