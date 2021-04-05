import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController, PopoverController } from '@ionic/angular';
import { Ad, Company } from 'src/app/company/company.page';

@Component({
  selector: 'app-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss'],
})
export class AdComponent implements OnInit {

  @Input() ad: Ad;
  @Input() sponsor: Company;
  @Input() preview: boolean = false;
  

  isLoading = false
  
  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    console.log("Sponsor", this.sponsor)
  }

  learnMore() {
    if (!this.preview) {
      console.log(this.ad)
      this.navCtrl.navigateForward(`/ad/${this.ad.id}`, {state: {ad: this.ad}})
    }
    
  }

  close() {
    this.modalCtrl.dismiss()
  }

}
