import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { ActiveGuard } from './_guards/active.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard, ActiveGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthPageModule),
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then((m) => m.ProfilePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'privacy',
    loadChildren: () => import('./privacy/privacy.module').then((m) => m.PrivacyPageModule),
  },
  /* { 
    path: 'view-sponsors', 
    loadChildren: () => import('./sponsors/view-sponsors/view-sponsors.module').then((m) => m.ViewSponsorsPageModule),
  }, */
  {
    path: 'sponsor/:id',
    loadChildren: () => import('./sponsors/sponsor.module').then((m) => m.SponsorPageModule),
  },
  { path: 'payment', 
    loadChildren: () => import('./payment/payment.module').then((m) => m.PaymentPageModule),
    canActivate: [ActiveGuard]
  },
  { path: 'company', loadChildren: './company/company.module#CompanyPageModule' },
  { path: 'ad/:id', loadChildren: './ad/ad.module#AdPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
