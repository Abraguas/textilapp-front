import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaymentMethod } from 'src/app/models/payment-method';
import { RegisterPaymentDTO } from 'src/app/models/register-payment-dto';
import { PaymentService } from 'src/app/services/payment.service';
import { SessionService } from 'src/app/services/session.service';
import { SweetAlert } from 'sweetalert/typings/core';
declare var require: any
const swal: SweetAlert = require('sweetalert');

@Component({
    selector: 'app-pay-order-button',
    templateUrl: './pay-order-button.component.html',
    styleUrls: ['./pay-order-button.component.css']
})
export class PayOrderButtonComponent implements OnInit, OnDestroy {
    form: FormGroup;
    private subscription: Subscription;
    @Input() paymentMethods: PaymentMethod[];
    @Input() orderId: number;

    @Output() onPaymentRegister = new EventEmitter();
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private sessionService: SessionService,
        private paymentService: PaymentService
    ) {
        this.form = this.formBuilder.group(
            {
                orderId: [this.orderId, []],
                observations: [, [Validators.maxLength(300)]],
                transactionNumber: [, [Validators.maxLength(300)]],
                paymentMethod: [, [Validators.required]],
            }
        );
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    ngOnInit(): void {
        this.subscription = new Subscription();

    }
    registerPayment(): void {
        if (this.form.valid) {
            let payment = this.form.value as RegisterPaymentDTO;
            payment.orderId = this.orderId;
            this.subscription.add(
                this.paymentService.registerPayment(payment).subscribe({
                    next: () => {
                        swal({ title: 'Listo!', text: `Se registró tu pago exitosamente.`, icon: 'success' }).then(() => {
                            this.onPaymentRegister.emit();
                        });
                        return;
                    },
                    error: (e) => {
                        if (this.statusCheck(e)) {
                            swal({ title: 'Error!', text: 'Se ha producido un error al registrar el pago', icon: 'error' });
                        }
                    }
                })
            );
        }
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
