import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams, PopoverController } from '@ionic/angular';
import { AdComponent } from 'src/app/_shared/ad/ad.component';
import { Ad, Company } from '../company.page';

@Component({
  selector: 'app-ad-options',
  templateUrl: './ad-options.component.html',
  styleUrls: ['./ad-options.component.scss'],
})
export class AdOptionsComponent implements OnInit {

  ad: Ad;
  company: Company;
  //saveDetails;

  constructor(
    private navParams: NavParams,
    private popoverCtrl: PopoverController,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) { 
    this.ad = this.navParams.get('ad');
    this.company = this.navParams.get('company')
    //this.saveDetails = this.navParams.get('saveDetails')
  }

  ngOnInit() {}

  async previewWindowAd(event) {
    //await this.saveDetails()
    this.popoverCtrl.dismiss()

    const modal = await this.modalCtrl.create({
      component: AdComponent,
      componentProps: {ad: this.ad, sponsor: this.company, preview: true},
      //translucent: true,
      backdropDismiss: true
    });
    await modal.present();
  }

  async previewFullAd() {
    //await this.saveDetails()
    this.navCtrl.navigateForward(`/ad/${this.ad.id}`, {state: {ad: this.ad, sponsor: this.company, preview: true}})
    this.popoverCtrl.dismiss()
  }

  viewData() {
    this.navCtrl.navigateForward(`/company/ad-data`, {state: {ad: this.ad, sponsor: this.company}})
    this.popoverCtrl.dismiss()
  }
  
}
