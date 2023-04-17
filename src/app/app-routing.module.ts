import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreSidebarComponent } from './components/bars/store-sidebar/store-sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { ProductCatalogComponent } from './components/product/product-catalog/product-catalog.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterComponent } from './components/user/register/register.component';
import { MyAccountComponent } from './components/user/my-account/my-account.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginPageComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'my-account', component: MyAccountComponent},
  { 
    path: 'store', component: StoreSidebarComponent,
    children: [
      {path: ':subCategory', component: ProductCatalogComponent},
      {path: '', redirectTo: '0',pathMatch: 'full'}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
