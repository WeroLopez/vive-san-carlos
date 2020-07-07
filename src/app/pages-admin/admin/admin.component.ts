import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import Swal from 'sweetalert2'
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  email: string = "edlopezugalde@gmail.com"
  password: string = "weduard.01"

  constructor(
    private router: Router, 
    private ngZone: NgZone,
    private firebaseAuth: AngularFireAuth) {
  }

  ngOnInit(): void {
    this.firebaseAuth.onAuthStateChanged( user => {
      if (user) {
        this.ngZone.run(() => {this.router.navigate(['admin/clients'])})
      } else {
        // No user is signed in.
      }
    })
  }

  enter() {
    if (this.email != "" && this.password != "") {
      this.firebaseAuth.signInWithEmailAndPassword(this.email, this.password)
      .then( user => {
        Swal.fire('', "", 'success')
        this.router.navigate(['admin/clients'])
      }).catch( error => {
        //var errorCode = error.code;
        //var errorMessage = error.message;
        Swal.fire({icon: 'error',title: 'Error',text: 'Algo está mal'})
      })
    }
  }

}
