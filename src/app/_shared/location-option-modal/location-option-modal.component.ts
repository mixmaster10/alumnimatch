import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/_services/api.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-location-option-modal',
  templateUrl: './location-option-modal.component.html',
  styleUrls: ['./location-option-modal.component.scss'],
})
export class LocationOptionModalComponent implements OnInit {

  miles = [1, 2, 5, 10, 20, 30, 50, 100, 200, 500, 1000, 5000, 10000];
  selectRadiusOption: any = {
    header: 'Select radius.',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  selectAudienceOption: any = {
    header: 'Choose which audience.',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  selectApproximateOption: any = {
    header: 'Select Approximate location option.',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  radius = 20;
  approximate: number;

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.approximate = Number(localStorage.approximate || 0);
    this.api.get('user/location').subscribe((res: any) => {
      this.radius = res.radius;
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onSubmit() {
    localStorage.setItem('approximate', '' + this.approximate);
    this.modalCtrl.dismiss({radius: this.radius});
  }

}
