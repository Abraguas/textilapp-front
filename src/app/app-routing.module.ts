import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreSidebarComponent } from './components/bars/store-sidebar/store-sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { ProductCatalogComponent } from './components/product/product-catalog/product-catalog.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterComponent } from './components/user/register/register.component';
import { MyAccountComponent } from './components/user/my-account/my-account.component';
import { ManagementSidebarComponent } from './components/bars/management-sidebar/management-sidebar.component';
import { RegisterProductComponent } from './components/product/register-product/register-product.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { UpdateProductComponent } from './components/product/update-product/update-product.component';
import { StockMovementsListComponent } from './components/stock/stock-movements-list/stock-movements-list.component';
import { AllStockMovementsListComponent } from './components/stock/all-stock-movements-list/all-stock-movements-list.component';
import { MyOrdersPageComponent } from './components/order/my-orders-page/my-orders-page.component';
import { PayOrderPageComponent } from './components/order/pay-order-page/pay-order-page.component';
import { ManagementPageComponent } from './components/management-page/management-page.component';
import { PendingOrdersPageComponent } from './components/order/pending-orders-page/pending-orders-page.component';
import { BrandAbmPageComponent } from './components/brand/brand-abm-page/brand-abm-page.component';
import { UserRankComponent } from './components/user/user-rank/user-rank.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { TotalEarningsPerMonthComponent } from './components/reports/total-earnings-per-month/total-earnings-per-month.component';
import { RegisterStockMovementComponent } from './components/stock/register-stock-movement/register-stock-movement.component';
import { CategoryAbmPageComponent } from './components/category/category-abm-page/category-abm-page.component';
import { HighestSellingProductsComponent } from './components/reports/highest-selling-products/highest-selling-products.component';
import { AllOrdersPageComponent } from './components/order/all-orders-page/all-orders-page.component';
import { AdminGuard } from './guards/admin.guard';
import { LoggedGuard } from './guards/logged.guard';
import { PaymentListComponent } from './components/payment/payment-list/payment-list.component';
import { TermsAndConditionsPageComponent } from './components/terms-and-conditions-page/terms-and-conditions-page.component';
import { FaqPageComponent } from './components/faq-page/faq-page.component';
import { ChangePasswordComponent } from './components/user/change-password/change-password.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'terms-and-conditions', component: TermsAndConditionsPageComponent },
    { path: 'faq-page', component: FaqPageComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'my-account', component: MyAccountComponent, canActivate: [LoggedGuard] },
    { path: 'change-password', component: ChangePasswordComponent, canActivate: [LoggedGuard] },
    { path: 'my-orders', component: MyOrdersPageComponent, canActivate: [LoggedGuard] },
    { path: 'pay-order', component: PayOrderPageComponent, canActivate: [LoggedGuard] },
    { path: 'pay-order/:id', component: PayOrderPageComponent, canActivate: [LoggedGuard] },
    {
        path: 'store', component: StoreSidebarComponent,
        children: [
            { path: '', component: ProductCatalogComponent },
            { path: '**', redirectTo: '', pathMatch: 'full' }
        ],
        canActivate: [LoggedGuard]
    },
    {
        path: 'management', component: ManagementSidebarComponent,
        children: [
            { path: '', component: ManagementPageComponent },
            { path: 'product/register', component: RegisterProductComponent },
            { path: 'product/update/:id', component: UpdateProductComponent },
            { path: 'product/list', component: ProductListComponent },
            { path: 'stock/list/:id', component: StockMovementsListComponent },
            { path: 'stock/list', component: AllStockMovementsListComponent },
            { path: 'stock/register', component: RegisterStockMovementComponent },
            { path: 'order/all', component: AllOrdersPageComponent },
            { path: 'order/pending', component: PendingOrdersPageComponent },
            { path: 'payment/all', component: PaymentListComponent },
            { path: 'brand', component: BrandAbmPageComponent },
            { path: 'category', component: CategoryAbmPageComponent },
            { path: 'category/:id', component: CategoryAbmPageComponent },
            { path: 'user/list', component: UserListComponent },
            { path: 'user/ranking', component: UserRankComponent },
            { path: 'totalEarningsPerMonth', component: TotalEarningsPerMonthComponent },
            { path: 'highestSellingProducts', component: HighestSellingProductsComponent }
        ],
        canActivate: [AdminGuard]
    },
    { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
