import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'navbar-landing',
  templateUrl: './navbar-landing.component.html',
  styleUrls: ['./navbar-landing.component.scss']
})
export class NavbarLandingComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  
  @HostListener('window:scroll', ['$event']) onScrollEvent($event){
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      document.getElementById("navbar").style.top = "0";
    } else {
      document.getElementById("navbar").style.top = "-55px";
    }
  }

  gotoLanding(){
    this.router.navigate(['']);
  }
  
  book() {
    
  }

}
