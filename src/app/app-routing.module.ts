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

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'my-account', component: MyAccountComponent },
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
            { path: 'product/register', component: RegisterProductComponent },
            { path: 'product/update/:id', component: UpdateProductComponent },
            { path: 'product/list', component: ProductListComponent }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
