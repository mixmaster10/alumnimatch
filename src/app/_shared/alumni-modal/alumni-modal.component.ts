import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';
import * as ClConstants from 'src/app/_config/current-life.constant';
import { ATHLETE_POSITIONS } from 'src/app/_config/athletes.constant';
import { ModalController, NavController } from '@ionic/angular';
import { SendMessageModalComponent } from '../send-message-modal/send-message-modal.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-alumni-modal',
  templateUrl: './alumni-modal.component.html',
  styleUrls: ['./alumni-modal.component.scss'],
})
export class AlumniModalComponent implements OnInit {

  DEGREE_TYPES = ['Bachelors', 'Masters', 'Doctoral'];
  ATHLETE_POSITIONS = ATHLETE_POSITIONS;
  ATHLETE_MEMBERS = ['YES - Athlete', 'Yes - Staff', 'No - But big fan', 'NO - Don\'t care'];
  RELIGIONS = ClConstants.RELIGIONS;
  RELATIONSHIPS = ClConstants.RELATIONSHIPS;
  isLoading = false;

  @Input() user: any;
  constructor(
    private api: ApiService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    console.log('user', this.user);
    this.getExtraUserData();
    document.getElementById("percent").style.border = ""
  }

  getExtraUserData() {
    this.isLoading = true;
    this.api.get('alumni/extra/' + this.user.id).subscribe((res: any) => {
      console.log('getExtraUserData', res);
      this.user.graduated = res.graduated;
      this.user.friends = res.friends;
      this.user.shares = res.shares;
      this.user.distance = res.distance;
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
    });
  }

  viewProfile() {
    this.navCtrl.navigateForward('/home/user/' + this.user.id);
    this.modalCtrl.dismiss();
  }

  async sendMessage() {
    // this.modalCtrl.dismiss();
    // this.router.navigate(['/home/messages/user'], {
    //   queryParams: {
    //     id: this.user.id
    //   }
    // });
    const modal = await this.modalCtrl.create({
      component: SendMessageModalComponent,
      componentProps: {rid: this.user.id, user: this.user},
      cssClass: 'send-message-modal-css'
    });
    return await modal.present();
  }


}
