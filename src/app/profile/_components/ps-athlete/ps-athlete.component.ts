import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalController, NavParams } from '@ionic/angular';
import { SelectModalComponent } from 'src/app/_shared/select-modal/select-modal.component';
import { ATHLETE_POSITIONS, ATHLETES, ATHLETE_STAFF_POSITIONS } from 'src/app/_config/athletes.constant';
import { UtilsService } from 'src/app/_services/utils.service';
import { ApiService } from 'src/app/_services/api.service';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-ps-athlete',
  templateUrl: './ps-athlete.component.html',
  styleUrls: ['./ps-athlete.component.scss'],
})
export class PsAthleteComponent implements OnInit {

  data: any = {};

  selectAthleteOption: any = {
    header: 'Were you an official member within your college’s athletic department?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  selectTeamPosOption: any = {
    header: 'What was your position?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  ALL_ATHLETES: any[] = ATHLETES;
  POSITIONS: string[] = ATHLETE_POSITIONS;

  constructor(
    private modalCtrl: ModalController,
    private utils: UtilsService,
    private api: ApiService,
    private dataServ: DataService
  ) { }

  ngOnInit() {
    this.getUserAthlete();
  }

  getUserAthlete() {
    this.api.get('user/athlete', true).subscribe((res: any) => {
      console.log('getUserProfile', res);
      if (res) {
        this.data = res;
        if (res.privacy === undefined) {
          console.log('undefine privacy');
          this.data.privacy = true;
        }
      }
    });
  }

  athleteSelectChanged(event) {
    console.log("Athlete select changed: ", event)
    if (event.detail.value === 0) {
      this.POSITIONS = ATHLETE_POSITIONS
    } else if (event.detail.value === 1) {
      this.POSITIONS = ATHLETE_STAFF_POSITIONS
    } else {
      this.data.athlete = null
      this.data.position = null
    }

    if (this.data.member !== event.detail.value) {
      //this.data.athlete = null
      this.data.position = null
    }
    
    this.data.member = event.detail.value
  }

  async selectAthlete(athlete) {
    const modal = await this.modalCtrl.create({
      component: SelectModalComponent,
      componentProps: {
        items: this.ALL_ATHLETES,
        selectedItem: athlete ? athlete.id : null,
        multiple: false,
        title: 'Select athlete'
      },
      cssClass: 'select-modal-css',
      backdropDismiss: false
    });
    modal.onDidDismiss().then((res) => {
      console.log('chooseAthlete', JSON.stringify(res));
      if (res.data) {
        this.data.athlete = res.data;
      }
    }).catch((err) => {
      console.error('chooseOrg', err);
    });
    return await modal.present();
  }

  onSubmit() {
    let body;
    console.log('this.data', this.data);
    if (this.data.member === 0) {
      if (!this.data.athlete) {
        this.utils.presentErrorAlert('Please select athlete');
        return;
      }
      if (this.data.position === undefined) {
        this.utils.presentErrorAlert('Please select position');
        return;
      }
      body = {
        privacy: this.data.privacy,
        member: 0,
        athlete: this.data.athlete,
        position: this.data.position
      };
    } else {
      body = {
        privacy: this.data.privacy,
        member: this.data.member
      };
    }
    console.log('body', JSON.stringify(body));
    this.api.post('user/athlete', body, true).subscribe((res) => {
      console.log('saveUserAthlete', JSON.stringify(res));
      this.modalCtrl.dismiss({success: true});
      this.dataServ.updateUserData({ps: {athlete: body}})
    }, (err) => {
      console.error('saveUserAthlete', err);
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
