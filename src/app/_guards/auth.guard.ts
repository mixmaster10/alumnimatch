import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private menuCtrl: MenuController, private auth: AuthService) { }

  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      if (localStorage.token) {
        this.menuCtrl.enable(true);
        
        resolve(true);
      } else {
        this.auth.signout();
        reject(false);
      }
    });
  }
}
