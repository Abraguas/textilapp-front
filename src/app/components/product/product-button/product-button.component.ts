import { Component, Input } from '@angular/core';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product-button',
  templateUrl: './product-button.component.html',
  styleUrls: ['./product-button.component.css']
})
export class ProductButtonComponent {
  @Input() modalId: number = 1;
  @Input() disabled: boolean;
  @Input() product: Product;
  defaultRoute:string;
  quantity: number = 1;
  maxQuantity: number = 20;
  minQuantity: number = 1;

  quantityChange(x: boolean): void {
    if(x) {
      if(this.quantity >= this.maxQuantity){
        return
      }
      this.quantity=this.quantity+1;
    }
    else {
      if(this.quantity <= this.minQuantity){
        return
      }
      this.quantity=this.quantity-1;
      
    }
  }
  add(): void {

  }
  clearModal(): void {

  }
}
