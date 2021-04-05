import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/_services/api.service';
import { AuthService } from 'src/app/_services/auth.service';
import { DataService } from 'src/app/_services/data.service';
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  subscriptions: Subscription[] = []

  constructor(
    private navCtrl: NavController,
    private auth: AuthService,
    private utils: UtilsService,
    private dataServ: DataService,
    private api: ApiService
  ) { }

  ngOnInit() {
    
  }

  goBack() {
    this.navCtrl.navigateBack('auth');
  }

  login(social) {
    console.log('login', social);
    const sub = this.auth.login(social.type, social.id).subscribe((res: any) => {
      console.log('login', JSON.stringify(res));
      //this.dataServ.initUserData(res)
      localStorage.setItem('token', res.token);

      this.setUserData()

      if (res.user.verified_at) {
        localStorage.setItem('verified', res.user.activated_at);
        if (res.user.activated_at) {
          localStorage.setItem('activated', res.user.activated_at);
          let logins = localStorage.getItem('logins');
          logins = String(Number(logins || 0) + 1)
          this.navCtrl.navigateRoot('/home', {state: {login: logins}});
        } else {
          this.navCtrl.navigateForward('/auth/inactive');
        }
      } else {
        this.navCtrl.navigateRoot('/profile');
      }
    }, (err) => {
      console.error('login', err);
      this.utils.presentToast(err.error.message || 'Sorry. You failed to log in AlumniMatch.');
    });

    this.subscriptions.push(sub)
  }

  setUserData() {
    const sub1 = this.api.get('user').subscribe((res: any) => {
      console.log('getUserData', res);
      if (res) {
        this.dataServ.initUserData(res)
      }
    }, (err) => {
      console.error('user', err);
    });

    this.subscriptions.push(sub1)
  }

}
