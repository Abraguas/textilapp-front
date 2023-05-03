import { Component, Input, OnInit } from '@angular/core';
import { GetOrderDTO } from 'src/app/models/get-order-dto';
import { OrderDetailDTO } from 'src/app/models/order-detail-dto';

@Component({
    selector: 'app-order-detail-button',
    templateUrl: './order-detail-button.component.html',
    styleUrls: ['./order-detail-button.component.css']
})
export class OrderDetailButtonComponent implements OnInit {
    @Input() modalId: number = 1;
    @Input() order: GetOrderDTO;
    totalPrice: number = 0;
    defaultRoute: string = "../../assets/img/default-item.jpg";
    onImgError(event: any): void {
        event.target.src = this.defaultRoute;
    }
    ngOnInit(): void {
        this.order.details.forEach((d: OrderDetailDTO) => {
            this.totalPrice += d.pricePerUnit * d.quantity;
        });
    }

}
