import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import {FirestoreUserModel} from '../component/firestoreuser/firestoreuser.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { tap, map, take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(
    public afAuth: AngularFireAuth,
    public userService: UserService,
    private router: Router
  ) {}

  canActivate(): Promise<boolean>{
    return new Promise((resolve, reject) => {
      this.userService.getCurrentUser()
      .then(user => {
        this.router.navigate(['/user']);
        return resolve(false);
      }, err => {
        return resolve(true);
      })
    })
  } 

  /*  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
console.info("User inside auth guard"+user);
    return this.userService.user$.pipe(
      take(1),
      map(user => user && this.userService.canRead(user) ? true : false), // <-- important line
      tap(canView => {
        if (!canView) {
          console.error('Access denied. Must have permission to view content');
        }
      })
    );
  }  */
}
