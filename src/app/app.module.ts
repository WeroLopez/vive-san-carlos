//Angular modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Angular material modules
import { 
  MatButtonModule, 
  MatSelectModule,
  MatGridListModule,
  MatDividerModule,
  MatCardModule,
  MatInputModule,
  MatFormFieldModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatIconModule
} from '@angular/material';
//Firebase modules
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
//Other modules
// ...
//App pages
import { AppComponent } from './app.component';
import { BookingComponent } from './pages-admin/booking/booking.component';
import { LandingComponent } from './pages/landing/landing.component';
import { AdminComponent } from './pages-admin/admin/admin.component';
import { ClientsComponent } from './pages-admin/clients/clients.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
//App components
import { NavbarComponent } from './components/navbar/navbar.component';
import { NavbarAdminComponent } from './components/navbar-admin/navbar-admin.component';
//Servicios
import { CanActivateAdminRouteGuard } from './services/admin-route-guard';
import { DialogAddClientComponent } from './components/dialog-add-client/dialog-add-client.component';
import { SelectedDatePipePipe } from './pipes/selected-date-pipe.pipe';
import { PricePipePipe } from './pipes/price-pipe.pipe';
import { NavbarLandingComponent } from './components/navbar-landing/navbar-landing.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    //App components
    AppComponent,
    LandingComponent,
    NavbarComponent,
    NavbarAdminComponent,
    AdminComponent,
    ClientsComponent,
    BookingComponent,
    NotFoundComponent,
    DialogAddClientComponent,
    SelectedDatePipePipe,
    PricePipePipe,
    NavbarLandingComponent,
    FooterComponent
  ],
  imports: [
    //Angular modules
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    //Angular material modules
    MatButtonModule,
    MatSelectModule,
    MatGridListModule,
    MatDividerModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatIconModule,
    //Firebase modules
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireModule,
    AngularFirestoreModule,
    AngularFireAuthModule
    //Other modules
    // ...
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    CanActivateAdminRouteGuard,
    AngularFirestoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
