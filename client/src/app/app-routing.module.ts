import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginContainerComponent } from './components/login/login-container/login-container.component';
import { SignUpComponent } from './components/login/sign-up/sign-up.component';
import { MainContainerComponent } from './components/main/main-container/main-container.component';
import { OrderContainerComponent } from './components/order/order-container/order-container.component';

const routes: Routes = [
  { path: 'login', component: LoginContainerComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'main', component: MainContainerComponent },
  { path: 'order', component: OrderContainerComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
