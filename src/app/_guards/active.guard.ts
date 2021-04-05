import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuController, NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ActiveGuard implements CanActivate {
  constructor(private menuCtrl: MenuController, private nav: NavController, private router: Router) { }

  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      if (localStorage.verified) {
        if (localStorage.activated) {
          this.menuCtrl.enable(true);
          /* console.log(next, state, this.router.)
          if (state.url === '/payment') {
            this.nav.navigateRoot('/home')
            reject(false)
          } else { */
            resolve(true)
          //}
        } else {
          this.nav.navigateRoot('/auth/inactive');
          reject(false);
        }
      } else {
        this.nav.navigateRoot('/profile');
        reject(false);
      }
    });
  }
}
