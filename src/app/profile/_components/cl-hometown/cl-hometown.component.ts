import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';
import { ModalController } from '@ionic/angular';
import { PickLocationModalComponent } from 'src/app/_shared/pick-location-modal/pick-location-modal.component';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-cl-hometown',
  templateUrl: './cl-hometown.component.html',
  styleUrls: ['./cl-hometown.component.scss'],
})
export class ClHometownComponent implements OnInit {

  data: any = {};
  constructor(
    private api: ApiService,
    private modalCtrl: ModalController,
    private dataServ: DataService
  ) { }

  ngOnInit() {
    this.getHometown();
  }

  getHometown() {
    this.api.get('user/hometown', true).subscribe((res) => {
      console.log('user/hometown', res);
      this.data = res;
    }, (err) => {
      console.error('user/hometown', err);
    });
  }

  onSubmit() {
    this.api.post('user/hometown', this.data, true).subscribe((res) => {
      console.log('user/hometown', res);
      this.modalCtrl.dismiss({success: true});
      this.dataServ.updateUserData({cl: {hometown: this.data}})

    }, (err) => {
      console.error('user/hometown', err);
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
