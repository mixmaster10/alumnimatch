import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/_services/auth.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss'],
})
export class JoinComponent implements OnInit {

  termsAgreed: boolean = true;

  constructor(
    private navCtrl: NavController,
    private auth: AuthService,
    private utils: UtilsService,
    private api: ApiService
  ) { }

  ngOnInit() {}

  goBack() {
    this.navCtrl.navigateBack('auth');
  }

  viewPrivacy() {
    this.navCtrl.navigateForward('/privacy');
  }

  join(data) {
    console.log(data)
    if (this.termsAgreed) {
      this.auth.isRegisteredUser(data.type, data.id).subscribe((res) => {
        if (res) {
          sessionStorage.setItem('user', JSON.stringify(data));
          this.navCtrl.navigateForward(`auth/verify-code/${data.type}`);
        }
      }, (err) => {
        this.utils.presentErrorAlert(err.error.message || 'Sorry. error occured in this step.');
      });
    } else {
      alert("Please accept our terms before joining your alumni network.")
    }
    
  }

}
