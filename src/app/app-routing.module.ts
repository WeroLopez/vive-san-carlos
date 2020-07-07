import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateAdminRouteGuard } from './services/admin-route-guard';

import { AppComponent } from './app.component';
import { BookingComponent } from './pages-admin/booking/booking.component';
import { LandingComponent } from './pages/landing/landing.component';
import { AdminComponent } from './pages-admin/admin/admin.component';
import { ClientsComponent } from './pages-admin/clients/clients.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/clients', component: ClientsComponent, canActivate: [CanActivateAdminRouteGuard] },
  { path: 'admin/booking', component: BookingComponent, canActivate: [CanActivateAdminRouteGuard] },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
