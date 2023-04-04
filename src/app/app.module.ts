import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/bars/navbar/navbar.component';
import { StoreSidebarComponent } from './components/bars/store-sidebar/store-sidebar.component';
import { ManagementSidebarComponent } from './components/bars/management-sidebar/management-sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { TestComponent } from './components/test/test.component';
import { ProductButtonComponent } from './components/product/product-button/product-button.component';
import { CategoryService } from './services/category.service';
import { StorePageComponent } from './components/store/store-page/store-page.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    StoreSidebarComponent,
    ManagementSidebarComponent,
    HomeComponent,
    TestComponent,
    ProductButtonComponent,
    StorePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    CategoryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
