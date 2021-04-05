import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NavController } from '@ionic/angular';
import { UtilsService } from './utils.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private APIURL: any = environment.BASEURL + 'api/';

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private utils: UtilsService,
    private dataSv: DataService
  ) { }

  isRegisteredUser(social, sid) {
    this.utils.showLoading();
    return this.http.get( this.APIURL + `auth/exist/${social}/${sid}`).pipe(
      map(res => {
        console.log('isRegisteredUser', res);
        return res;
      }),
      finalize(() => {
        this.utils.hideLoading();
      })
    );
  }

  register(data) {
    this.utils.showLoading();
    return this.http.post(this.APIURL + 'auth/register', data).pipe(
      map((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('college', JSON.stringify(res.user.college));
        localStorage.setItem('user', JSON.stringify({
          id: res.user.id,
          avatar: res.user.avatar,
          first_name: res.user.first_name,
          last_name: res.user.last_name
        }));
        return res;
      }),
      catchError(this.handleErrors),
      finalize(() => {
        this.utils.hideLoading();
      })
    );
  }

  login(social, sid) {
    this.utils.showLoading();
    console.log(this.APIURL);
    return this.http.post(this.APIURL + 'auth/login', {
      social,
      sid
    }, { headers: this.setHttpHeaders() }).pipe(
      map((res: any) => {
        console.log(res)
        localStorage.setItem('token', res.token);
        localStorage.setItem('college', JSON.stringify(res.user.college));
        localStorage.setItem('user', JSON.stringify({
          id: res.user.id,
          avatar: res.user.avatar,
          first_name: res.user.first_name,
          last_name: res.user.last_name,
          signin_method: social
        }));
        return res;
      }),
      catchError(this.handleErrors),
      finalize(() => {
        this.utils.hideLoading();
      })
    );
  }

  signout(): void {
    const logins = localStorage.getItem("logins")
    if (localStorage.token) {
      const ionModals = document.getElementsByTagName('ion-modal');
      console.log('ionModals', ionModals);
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < ionModals.length; i++) {
        const element = ionModals[i];
        element.dismiss();
      }
      this.http.get(
        this.APIURL + 'auth/logout?device_token=' + localStorage.device_token,
        { headers: this.setHttpHeaders() })
      .subscribe((res) => {
        console.log('logout', res);
        localStorage.clear();
        localStorage.setItem("logins", logins)
        this.dataSv.clearUser()
        this.navCtrl.navigateRoot('/auth');
      }, (err) => {
        console.error('logout', err);
        localStorage.clear();
        localStorage.setItem("logins", logins)
        this.dataSv.clearUser()
        this.navCtrl.navigateRoot('/auth');
      });
    } else {
      localStorage.clear();
      localStorage.setItem("logins", logins)
      this.dataSv.clearUser()
      this.navCtrl.navigateRoot('/auth')
    }

  }

  private setHttpHeaders() {
    console.log("Setting Headers")
    const header = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
    console.log("Done with Headers", header)
    return header;
  }

  private handleErrors(error: HttpErrorResponse) {
    console.log('handleError', JSON.stringify(error));
    if (error.status === 401) {
      this.signout();
    }
    return throwError(error);
  }

}
