import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-invite-code',
  templateUrl: './invite-code.page.html',
  styleUrls: ['./invite-code.page.scss'],
})
export class InviteCodePage implements OnInit {

  code: any;
  expired: any;
  constructor(
    private navCtrl: NavController,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.getInviteCode();
  }

  back() {
    this.navCtrl.navigateBack('/home');
  }

  getInviteCode() {
    this.api.get('user/invite-code').subscribe((res: any) => {
      console.log('getInviteCode', res);
      this.code = res.code;
      this.expired = res.expired;
    });
  }

  refreshCode() {
    this.api.get('user/generate-code').subscribe((res: any) => {
      console.log('generateInviteCode', res);
      this.code = res.code;
      this.expired = res.expired;
    });
  }

}
