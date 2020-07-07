import { Injectable, NgZone } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root',
})
export class CanActivateAdminRouteGuard implements CanActivate {

  constructor(
    private router: Router, 
    private ngZone: NgZone,
    private firebaseAuth: AngularFireAuth){
  }

  canActivate():  boolean | Observable<boolean> | Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.firebaseAuth.onAuthStateChanged((user: firebase.User) => {
        if (user) {
          resolve(true)
        } else {
          this.ngZone.run(() => this.router.navigate(['admin']))
          resolve(false)
        }
      })
    })
  }
}