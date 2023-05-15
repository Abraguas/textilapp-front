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

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'my-account', component: MyAccountComponent },
    { path: 'my-orders', component: MyOrdersPageComponent },
    { path: 'pay-order', component: PayOrderPageComponent },
    { path: 'pay-order/:id', component: PayOrderPageComponent },
    {
        path: 'store', component: StoreSidebarComponent,
        children: [
            { path: '', component: ProductCatalogComponent },
            { path: '**', redirectTo: '', pathMatch: 'full' }
        ]
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
            { path: 'order/pending', component: PendingOrdersPageComponent },
            { path: 'brand', component: BrandAbmPageComponent },
            { path: 'user/list', component: UserListComponent },
            { path: 'user/ranking', component: UserRankComponent }
        ]
    },
    { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
