import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';
import { ModalController } from '@ionic/angular';
import { PickLocationModalComponent } from 'src/app/_shared/pick-location-modal/pick-location-modal.component';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-cl-home-base-location',
  templateUrl: './cl-home-base-location.component.html',
  styleUrls: ['./cl-home-base-location.component.scss'],
})
export class ClHomeBaseLocationComponent implements OnInit {

  data: any = {};
  constructor(
    private api: ApiService,
    private modalCtrl: ModalController,
    private dataServ: DataService
  ) { }

  ngOnInit() {
    this.getHomeBase();
  }

  getHomeBase() {
    this.api.get('user/home', true).subscribe((res) => {
      console.log('user/home', res);
      this.data = res;
    }, (err) => {
      console.error('user/home', err);
    });
  }

  onSubmit() {
    this.api.post('user/home', this.data, true).subscribe((res) => {
      console.log('user/home', res);
      this.modalCtrl.dismiss({success: true});
      this.dataServ.updateUserData({cl: {home: this.data}})
    }, (err) => {
      console.error('user/home', err);
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async selectLocation() {
    const modal = await this.modalCtrl.create({
      component: PickLocationModalComponent,
      backdropDismiss: false
    });
    modal.onWillDismiss().then((result) => {
      if (result && result.data) {
        console.log('result', result.data);
        this.data.country = result.data.country;
        this.data.state = result.data.state;
        this.data.zip = result.data.zip;
      }
    });
    return await modal.present();
  }

}
