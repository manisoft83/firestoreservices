import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { FirestoreuserComponent } from './component/firestoreuser/firestoreuser.component';
import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';
import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { UserResolver } from './services/user.resolver';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FirestoreuserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    ReactiveFormsModule,
    RouterModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    FormsModule
  ],
  providers: [AuthService, UserService, AuthGuard, UserResolver],
  bootstrap: [AppComponent]
})
export class AppModule { }
