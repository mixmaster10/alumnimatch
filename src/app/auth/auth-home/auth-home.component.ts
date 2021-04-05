import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-auth-home',
  templateUrl: './auth-home.component.html',
  styleUrls: ['./auth-home.component.scss'],
})
export class AuthHomeComponent implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {}

  next(point) {
    if (point === 0) {
      this.navCtrl.navigateForward('auth/login');
    } else {
      this.navCtrl.navigateForward('auth/join');
    }
  }

}
