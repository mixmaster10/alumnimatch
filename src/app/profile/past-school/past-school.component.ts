import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { PsDegreeComponent } from '../_components/ps-degree/ps-degree.component';
import { PsOrgComponent } from '../_components/ps-org/ps-org.component';
import { PsAthleteComponent } from '../_components/ps-athlete/ps-athlete.component';
import { ApiService } from 'src/app/_services/api.service';
import { PsCollegesComponent } from '../_components/ps-colleges/ps-colleges.component';

@Component({
  selector: 'app-past-school',
  templateUrl: './past-school.component.html',
  styleUrls: ['./past-school.component.scss'],
})
export class PastSchoolComponent implements OnInit {

  verified = true;
  completes: any = {
    degrees: false,
    orgs: false,
    athletes: false
  };

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private nav: NavController
  ) {
    if (localStorage.verified) {
      this.verified = true;
    } else {
      this.verified = false;
    }
  }

  ngOnInit() {
    this.getPSProfileCompleted();
  }

  getPSProfileCompleted() {
    this.api.get('user/completed/ps', true).subscribe((res) => {
      console.log('user/completed/ps', JSON.stringify(res));
      this.completes = res;
    }, (err) => {
      console.error('user/completed/ps', err);
    });
  }

  openSubProfile(key) {
    switch (key) {
      case 'degree':
        this.openDegreeModal();
        break;
      case 'org':
        this.openOrgModal();
        break;
      case 'athlete':
        this.openAthleteModal();
        break;
      case 'colleges':
        this.openCollegesModal();
        break;
      default:
        break;
    }
  }

  async openDegreeModal() {
    const modal = await this.modalCtrl.create({
      component: PsDegreeComponent,
      backdropDismiss: false
    });
    modal.onWillDismiss().then((res) => {
      if (res.data && res.data.success) {
        this.completes.degrees = true;
      }
    });
    return await modal.present();
  }

  async openCollegesModal() {
    const modal = await this.modalCtrl.create({
      component: PsCollegesComponent,
      backdropDismiss: false
    });
    modal.onWillDismiss().then((res) => {
      if (res.data && res.data.success) {
        this.completes.colleges = true;
      }
    });
    return await modal.present();
  }

  async openOrgModal() {
    const modal = await this.modalCtrl.create({
      component: PsOrgComponent,
      backdropDismiss: false
    });
    modal.onWillDismiss().then((res) => {
      if (res.data && res.data.success) {
        this.completes.orgs = true;
      }
    });
    return await modal.present();
  }

  async openAthleteModal() {
    const modal = await this.modalCtrl.create({
      component: PsAthleteComponent,
      backdropDismiss: false
    });
    modal.onWillDismiss().then((res) => {
      if (res.data && res.data.success) {
        this.completes.athletes = true;
      }
    });
    return await modal.present();
  }

  onSubmit() {
    this.nav.navigateForward('/profile/current-life');
  }

  goBack() {
    this.nav.navigateBack('/profile');
  }

}
