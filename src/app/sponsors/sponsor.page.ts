import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Ad, Company } from '../company/company.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ApiService } from '../_services/api.service';
import { CompanyService } from '../_services/company.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sponsor',
  templateUrl: './sponsor.page.html',
  styleUrls: ['./sponsor.page.scss'],
})
export class SponsorPage implements OnInit {
  
  //uid: string;
  sponsor: Company;
  activeAds: Ad[];

  constructor(
    private iab: InAppBrowser,
    private companyServ: CompanyService,
    private route: ActivatedRoute,
    //private navParams: NavParams
    //private navCtrl: NavController
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.sponsor = await this.getSponsor(Number(id))
  }

  goToWebPage() {
    console.log('Going to webpage')
    const browser = this.iab.create(this.sponsor.websiteLink, '_blank');
    browser.show()
  }

  goToVideo() {
    console.log('Going to video')
    const browser = this.iab.create(this.sponsor.videoLink, '_blank');

    browser.show()
  }
  
  async getSponsor(id: number): Promise<Company> {
    return await this.companyServ.getCompany(id)
  }

  back() {
    history.back()
  }
  
}
