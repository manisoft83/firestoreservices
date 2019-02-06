import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {FirestoreUserModel} from '../component/firestoreuser/firestoreuser.model';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user$: Observable<FirestoreUserModel>;
 
  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth
  ){
    this.user$ = this.afAuth.authState
        .switchMap(user => {
          if (user) {
            return this.db.doc<FirestoreUserModel>(`payrollusers/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })
  }
 
 
   getCurrentUser(){
     console.info("Inside getCurrentUser!");
     
     return new Promise<any>((resolve, reject) => {
       var user = firebase.auth().onAuthStateChanged(function(user){
         if (user) {
           resolve(user);
         } else {
           reject('No user logged in');
         }
       })
     })
   }
 
   updateCurrentUser(value){
     return new Promise((resolve, reject) => {
       var user = firebase.auth().currentUser;
       user.updateProfile({
         displayName: value.name,
         photoURL: user.photoURL
       }).then(res => {
         resolve()
       }, err => reject(err))
     })
   }

   canRead(user: FirestoreUserModel): boolean {
     return true;
    /*  console.info("User -->"+user);
    const allowed = ['admin', 'editor', 'subscriber']
    return this.checkAuthorization(user, allowed) */
  }
  
  canEdit(user: FirestoreUserModel): boolean {
    console.info("Inside canEdit!");
    const allowed = ['admin', 'editor']
    return this.checkAuthorization(user, allowed)
  }
  
  canDelete(user: FirestoreUserModel): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
  }
  
  
  
  // determines if user has matching role
  private checkAuthorization(user: FirestoreUserModel, allowedRoles: string[]): boolean {
    console.info("checkAuthorization-->"+user);
    console.info("checkAuthorization-->"+ user.roles);
    if (!user) return false
    for (const role of allowedRoles) {
     /*  user.subscribe(evt => {
        console.log("evt--->"+evt);
        console.log(evt["roles"][role]);
    
    return true;}); */
       if (user.roles && user.roles[role] ) {
        return true;
      } 
    }
    return false
  }
}
