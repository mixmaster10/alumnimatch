import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss'],
})
export class VerifyCodeComponent implements OnInit {

  inviteCode: number;
  social: string;
  constructor(
    private nav: NavController,
    private route: ActivatedRoute,
    private api: ApiService,
    private utils: UtilsService
  ) { }

  ngOnInit() {
    this.social = this.route.snapshot.paramMap.get('social');
  }

  verifyInviteCode() {
    this.api.get(`auth/invite/verify/${this.inviteCode}`).subscribe((res) => {
      console.log('verifyInviteCode', res);
      const user = {...JSON.parse(sessionStorage.user), inviterId: res}
      sessionStorage.setItem('user', JSON.stringify(user));
      this.nav.navigateForward(`auth/choose-college`);
    }, (err) => {
      console.error('verifyInviteCode', err);
      this.utils.presentErrorAlert(err.error.message);
    });
  }
}
