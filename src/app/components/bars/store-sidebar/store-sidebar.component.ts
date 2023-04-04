import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryDTO } from 'src/app/models/category-dto';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-store-sidebar',
  templateUrl: './store-sidebar.component.html',
  styleUrls: ['./store-sidebar.component.css']
})
export class StoreSidebarComponent implements OnInit, OnDestroy {
  categories: CategoryDTO[];
  private subscription: Subscription;

  constructor(private categoryService: CategoryService) {}
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = new Subscription;
    this.loadCategories();
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
  colors = [
    {
      id: 1,
      name: "Rojos"
    },
    {
      id: 2,
      name: "Verdes"
    },
    {
      id: 3,
      name: "Amarillos"
    },
    {
      id: 4,
      name: "Azules"
    }
  ];
}
