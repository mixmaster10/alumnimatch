import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ApiService } from '../_services/api.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AdService } from '../_services/ad.service';
import { AdComment } from '../ad/ad.page';
import { DataService } from '../_services/data.service';
import { map } from 'rxjs/operators';

export interface Ad {
  leadsRemaining: number;
  totalLeads: number;
  title: string;
  description: string;
  company_id: number;
  companyName: string;
  active: boolean;
  id: number;
  created_at: string;

  leadsUsed?: {
    likes?: [{
      user_id: string;
      user_email?: string;
      message?: string;
      created_at?: Date;
    }], 
    comments?: AdComment[], 
    viewed_sponsor?: [{
      user_id: string
      created_at?: Date
    }]
  }

  //isLiked?: boolean;
  websiteLink?: string;
  audience?: string;
  photoUrl?: string;
}


export interface Company {
  id: number;
  companyName: string;
  creatorTitle: string;
  creator_id: number;
  companyStartedOn: string;
  description: string;
  leadsBalance: number;
  paid: boolean;
  ads: Ad[];

  websiteLink?: string;
  videoLink?: string;
  photoUrl?: string;
  match?: number;
}

@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {

  company: Company = {id: -1, companyName: '', creatorTitle: '', creator_id: -1, companyStartedOn: '', description: '', leadsBalance: -1, paid: true, ads: []}
  activeAds: Ad[] = []

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private api: ApiService,
    private iab: InAppBrowser,
    private dataServ: DataService
  ) { }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    if (history.state.company) {
      this.company = history.state.company
      console.log("IOn View Enter company: ", JSON.stringify(this.company))
    } else {
      this.getCompany()
    }
  }
 
  async purchaseLeads() {
    console.log('Purchase leads')
    await this.navCtrl.navigateForward('/payment', {state: {company: this.company, pageAfterPayment: '/company', product: 'leads'}})
  }

  createAd() {
    console.log('Create an Ad')
    this.navCtrl.navigateForward('/company/ad-edit', {state: {company: this.company}})
  }

  getCompany() {
    this.api.get('user/company').subscribe((res: any) => {
      console.log('getCompanyData', res);
      if (res.length > 0) {
        this.company = res[0];
        if (this.company.ads) {
          this.activeAds = this.company.ads.filter(ad => ad.active)
        }
      } else {
        console.log("No Company", this.company)
        this.company.paid = false
        //this.company.creator_id = this.dataServ.userInfo.id
      }
      
    }, (err) => {
      console.error('Company Data: ', err);
      this.company.paid = false
    });
  }

  async back() {
    await this.navCtrl.navigateBack('/home');
  }

  goToWebPage() {
    console.log('Going to webpage')
    const browser = this.iab.create(this.company.websiteLink, '_blank');

    browser.show()
    // browser.insertCSS(...);
    /* browser.on('loadstop').subscribe(event => {
       browser.insertCSS({ code: "body{color: red;" });
    }); */

    //browser.close();
  }

  goToVideo() {
    console.log('Going to video')

    const browser = this.iab.create(this.company.videoLink, '_blank');

    browser.show()
  }

  async editCompany() {
    console.log("Editing Company")
    await this.navCtrl.navigateForward(`/company/edit`, {state: {company: this.company}})
  }

}
