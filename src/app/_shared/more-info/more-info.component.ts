import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Ad, Company } from 'src/app/company/company.page';
import { AdService } from 'src/app/_services/ad.service';

@Component({
  selector: 'app-more-info',
  templateUrl: './more-info.component.html',
  styleUrls: ['./more-info.component.scss'],
})
export class MoreInfoComponent implements OnInit {

  ad: Ad = {
    title: "Demo Ad", 
    description: "This is a demo ad to show", 
    companyName: "AlumniMatch", 
    company_id: -1, 
    photoUrl: 'assets/imgs/Your_Company_Logo.png', 
    leadsRemaining: 0,
    leadsUsed: null,
    totalLeads: 0,
    active: false,
    id: -1,
    created_at: new Date().toString()
  }
  sponsor: Company = {
    id: -1, 
    companyName: "AlumniMatch", 
    companyStartedOn: 'September, 2020', 
    creatorTitle: 'CEO', 
    creator_id: -1, 
    description: "We created this platform", 
    leadsBalance: 0,
    ads: null,
    paid: true,
    photoUrl: 'assets/imgs/demo-avatar.png'
  }

  defaultSponsor: Company = {
    id: -1, 
    companyName: "AlumniMatch", 
    companyStartedOn: 'September, 2020', 
    creatorTitle: 'CEO', 
    creator_id: -1, 
    description: "We created this platform", 
    leadsBalance: 0,
    ads: null,
    paid: true,
    photoUrl: 'assets/imgs/demo-avatar.png'
  }

  defaultAd: Ad = {
    title: "Demo Ad", 
    description: "This is a demo ad to show", 
    companyName: "AlumniMatch", 
    company_id: -1, 
    photoUrl: 'assets/imgs/Your_Company_Logo.png', 
    leadsRemaining: 0,
    leadsUsed: null,
    totalLeads: 0,
    active: false,
    id: -1,
    created_at: new Date().toString()
  }


  constructor(
    private modalCtrl: ModalController,
    private adServ: AdService
  ) { }

  ngOnInit() {
    this.adServ.getRandomAd().then((res: any) => {
      console.log("Res from random ad", res)
      if (res) {
        this.ad = res.ad
        this.sponsor = res.sponsor
      } else {
        this.ad = this.defaultAd
        this.sponsor = this.defaultSponsor
      }
    }).catch(err => {
      console.error("Error getting random ad: ", err)
      this.ad = this.defaultAd
      this.sponsor = this.defaultSponsor
    })
  }

  continue() {
    this.modalCtrl.dismiss({success: true})
  }

}
