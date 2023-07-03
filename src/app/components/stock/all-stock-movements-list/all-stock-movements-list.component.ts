import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription, first } from 'rxjs';
import { StockMovementProdDTO } from 'src/app/models/stock-movement-prod-dto';
import { SessionService } from 'src/app/services/session.service';
import { StockMovementService } from 'src/app/services/stock-movement.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
    selector: 'app-all-stock-movements-list',
    templateUrl: './all-stock-movements-list.component.html',
    styleUrls: ['./all-stock-movements-list.component.css']
})
export class AllStockMovementsListComponent {
    private subscription = new Subscription();
    stockMovements: StockMovementProdDTO[];
    searchString: string;
    Math: any = Math;
    productNameForm: FormGroup;
    dateForm: FormGroup;
    constructor(
        private stockMovementService: StockMovementService,
        private router: Router,
        private sessionService: SessionService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute
    ) {
        this.productNameForm = this.formBuilder.group({
            productName: [,]
        })
        this.dateForm = this.formBuilder.group({
            startDate: [, [Validators.required]],
            endDate: [, [Validators.required]],
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    ngOnInit(): void {
        this.subscription.add(
            this.route.queryParams.subscribe((params) => {
                this.loadMovements(params['searchString'], params['startDate'], params['endDate']);
            })
        );
        this.route.queryParams
            .pipe(first())
            .subscribe(params => {
                this.productNameForm.patchValue({
                    productName: params['searchString'] ? params['searchString'] : ''
                });
                this.dateForm.patchValue({
                    startDate: params['startDate'] ? moment(params['startDate'], 'YYYY-MM-DDTHH:mm:ss').format("YYYY-MM-DD") : '',
                    endDate: params['endDate'] ? moment(params['endDate'], 'YYYY-MM-DDTHH:mm:ss').format("YYYY-MM-DD") : '',
                });
            });
        this.subscription.add(
            this.productNameForm.controls['productName'].valueChanges.subscribe((value) => {
                this.searchString = value;
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
        this.subscription.add(
            this.dateForm.valueChanges.subscribe(() => {
                if (this.dateForm.valid) {
                    const startDate = moment(this.dateForm.value.startDate).utc();
                    const endDate = moment(this.dateForm.value.endDate).utc();

                    startDate.startOf('day');
                    endDate.endOf('day');

                    const startDateString = startDate.format('YYYY-MM-DDTHH:mm:ss');
                    const endDateString = endDate.format('YYYY-MM-DDTHH:mm:ss');
                    let params: Params = {
                        startDate: '',
                        endDate: ''
                    };
                    params['startDate'] = startDateString;
                    params['endDate'] = endDateString;
                    this.router.navigate(
                        [

                        ],
                        {
                            relativeTo: this.route,
                            queryParams: params,
                            queryParamsHandling: 'merge'
                        });

                }
            })
        );
    }
    loadMovements(productName: string | undefined,
        startDate: string | undefined, endDate: string | undefined): void {
        this.subscription.add(
            this.stockMovementService.getAllMovements(productName ? productName : '', startDate, endDate).subscribe({
                next: (r: StockMovementProdDTO[]) => {
                    this.stockMovements = r;
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
}
