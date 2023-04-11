import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderDetailDTO } from 'src/app/models/order-detail-dto';
import { OrderDTO } from 'src/app/models/order-dto';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.css']
})
export class ProductCatalogComponent implements OnInit, OnDestroy {
  totalPrice: number;
  totalQuantity: number;
  subCategory: number;
  products: Product[];
  subscription: Subscription;
  order: OrderDTO;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = new Subscription();
    this.getSubCategory();
    this.order = new OrderDTO();
    this.order.details = [];

  }
  getSubCategory(): void {
    this.subscription.add(
      this.route.params.subscribe(params => {

        this.subCategory = params["subCategory"];
        this.loadProducts();
      })
    );
  }
  addDetail(detail: OrderDetailDTO): void {
    this.order.details.push(detail);
    this.getTotal();
    this.getTotalQuantity();
  }
  removeDetail(detail: OrderDetailDTO): void {
    let i = this.order.details.indexOf(detail);
    this.order.details.splice(i, 1);
    this.getTotal();
    this.getTotalQuantity();
  }
  loadProducts(): void {
    if (this.subCategory < 1 || !this.subCategory) {
      this.subscription.add(
        this.productService.getAll().subscribe({
          next: (r: Product[]) => {
            this.products = r;
            return;
          },
          error: (e) => {
            console.error(e);
            return;
          }
        })
      );
    } else {
      this.subscription.add(
        this.productService.getBySubcategory(this.subCategory).subscribe({
          next: (r: Product[]) => {
            this.products = r;
          },
          error: (e) => {
            console.error(e);
          }
        })
      );
    }
    
  }
  getTotal(): void {
    let total = 0;
    this.order.details.forEach(x => {
      total = total + x.pricePerUnit * x.quantity;
    });
    this.totalPrice = total;
  }

  getTotalQuantity(): void {
    let total = 0;
    this.order.details.forEach(x => {
      total = total + 1;
    })
    this.totalQuantity = total;
  }
  isAdded(p: Product): boolean {
    let cond = this.order.details.find(x => x.product.id === p.id);
    if (cond) {
      return true;
    }
    return false;
  }
}
