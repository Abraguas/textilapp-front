import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreSidebarComponent } from './components/bars/store-sidebar/store-sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { TestComponent } from './components/test/test.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { 
    path: 'store', component: StoreSidebarComponent,
    children: [{path: ':name', component: TestComponent}]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
