import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/bars/navbar/navbar.component';
import { StoreSidebarComponent } from './components/bars/store-sidebar/store-sidebar.component';
import { ManagementSidebarComponent } from './components/bars/management-sidebar/management-sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { ProductButtonComponent } from './components/product/product-button/product-button.component';
import { CategoryService } from './services/category.service';
import { HttpClientModule } from '@angular/common/http';
import { ProductCatalogComponent } from './components/product/product-catalog/product-catalog.component';
import { ProductService } from './services/product.service';
import { LogoutButtonComponent } from './components/logout-button/logout-button.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SessionService } from './services/session.service';
import { UserService } from './services/user.service';
import { OrderService } from './services/order.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    StoreSidebarComponent,
    ManagementSidebarComponent,
    HomeComponent,
    ProductButtonComponent,
    ProductCatalogComponent,
    LogoutButtonComponent,
    LoginPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    CategoryService,
    ProductService,
    UserService,
    SessionService,
    OrderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
