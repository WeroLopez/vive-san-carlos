import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.scss']
})
export class NavbarAdminComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  gotoClients(){
    this.router.navigate(['admin/clients']);
  }

  gotoBooking(){
    this.router.navigate(['admin/booking']);
  }

  gotoLanding(){
    this.router.navigate(['']);
  }

}
