import { LOCALE_ID, NgModule } from '@angular/core';
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
import { RegisterComponent } from './components/user/register/register.component';
import { MyAccountComponent } from './components/user/my-account/my-account.component';
import { RegisterProductComponent } from './components/product/register-product/register-product.component';
import { AuxiliarService } from './services/auxiliar.service';
import { UpdateProductComponent } from './components/product/update-product/update-product.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { StockMovementsListComponent } from './components/stock/stock-movements-list/stock-movements-list.component';
import { StockMovementService } from './services/stock-movement.service';
import { AllStockMovementsListComponent } from './components/stock/all-stock-movements-list/all-stock-movements-list.component';
import { MyOrdersPageComponent } from './components/order/my-orders-page/my-orders-page.component';
import { OrderDetailButtonComponent } from './components/order/order-detail-button/order-detail-button.component';
import { PaymentService } from './services/payment.service';
import { PayOrderPageComponent } from './components/order/pay-order-page/pay-order-page.component';
import { ManagementPageComponent } from './components/management-page/management-page.component';
import { PendingOrdersPageComponent } from './components/order/pending-orders-page/pending-orders-page.component';
import { PayOrderButtonComponent } from './components/order/pay-order-button/pay-order-button.component';
import { BrandAbmPageComponent } from './components/brand/brand-abm-page/brand-abm-page.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserRankComponent } from './components/user/user-rank/user-rank.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-AR';
import { TotalEarningsPerMonthComponent } from './components/reports/total-earnings-per-month/total-earnings-per-month.component';
import { BarChartComponent } from './components/chart/bar-chart/bar-chart.component';
import { RegisterStockMovementComponent } from './components/stock/register-stock-movement/register-stock-movement.component';
import { CategoryAbmPageComponent } from './components/category/category-abm-page/category-abm-page.component';

registerLocaleData(localeEs);

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
        LoginPageComponent,
        RegisterComponent,
        MyAccountComponent,
        RegisterProductComponent,
        UpdateProductComponent,
        ProductListComponent,
        StockMovementsListComponent,
        AllStockMovementsListComponent,
        MyOrdersPageComponent,
        OrderDetailButtonComponent,
        PayOrderPageComponent,
        ManagementPageComponent,
        PendingOrdersPageComponent,
        PayOrderButtonComponent,
        BrandAbmPageComponent,
        UserListComponent,
        UserRankComponent,
        TotalEarningsPerMonthComponent,
        BarChartComponent,
        RegisterStockMovementComponent,
        CategoryAbmPageComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'es-AR' },
        CategoryService,
        ProductService,
        UserService,
        SessionService,
        OrderService,
        AuxiliarService,
        StockMovementService,
        PaymentService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
