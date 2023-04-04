import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  name: string;
  product: Product = {
    id: 1,
    name: "Sabana",
    description: "lorem",
    brand: {
      name: "Bresia"
    },
    pricePerUnit: 100,
    unit: {
      name: "Metro"
    },
    observations: "",
    stock: 5,
    measurment: "4 mts de ancho",
    color: {
      name: "Rojos"
    },
    subCategory: null,
    image: "https://textiltriunvirato.com.ar/wp-content/uploads/2021/08/Sabana-Muri-Gris.jpeg"
  }

  constructor(
    private route: ActivatedRoute
  ) {
    this.subscription = new Subscription();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    let lol = this.route.snapshot.paramMap.get('name');
    this.name = lol? lol : '';
  }

}
