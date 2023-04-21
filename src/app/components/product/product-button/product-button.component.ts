import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderDetailDTO } from 'src/app/models/order-detail-dto';
import { Product } from 'src/app/models/product';

@Component({
    selector: 'app-product-button',
    templateUrl: './product-button.component.html',
    styleUrls: ['./product-button.component.css']
})
export class ProductButtonComponent {
    @Input() isNonFunctional = false;
    @Input() modalId: number = 1;
    @Input() disabled: boolean;
    @Input() product: Product;
    @Output() onAdd = new EventEmitter<OrderDetailDTO>();

    orderDetail: OrderDetailDTO;
    defaultRoute: string = "../../assets/img/default-item.jpg";
    quantity: number = 1;
    maxQuantity: number = 20;
    minQuantity: number = 1;
    onImgError(event: any): void {
        event.target.src = this.defaultRoute;
    }
    quantityChange(x: boolean): void {
        if (x) {
            if (this.quantity >= this.maxQuantity) {
                return
            }
            this.quantity = this.quantity + 1;
        }
        else {
            if (this.quantity <= this.minQuantity) {
                return
            }
            this.quantity = this.quantity - 1;

        }
    }
    add(): void {
        this.orderDetail = {
            quantity: this.quantity,
            pricePerUnit: this.product.pricePerUnit,
            product: this.product
        }
        this.onAdd.emit(this.orderDetail);
        this.disabled = true;
        this.clearModal();
    }

    clearModal(): void {
        this.orderDetail = new OrderDetailDTO();
        this.quantity = 1;
    }
}
