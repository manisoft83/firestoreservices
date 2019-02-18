import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { FirestoreuserComponent } from './component/firestoreuser/firestoreuser.component';
import { AddressComponent } from './component/address/address.component';
import { AuthGuard } from './services/auth.guard';
import { UserResolver } from './services/user.resolver';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent , canActivate: [AuthGuard] },
  { path: 'firestoreuser', component: FirestoreuserComponent, resolve: { data: UserResolver} },
  { path: 'address', component: AddressComponent, resolve: { data: UserResolver} },
  { path: 'user', component: FirestoreuserComponent, resolve: { data: UserResolver}},
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes) 
  ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }
