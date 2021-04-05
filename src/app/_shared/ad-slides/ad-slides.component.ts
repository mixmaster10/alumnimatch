import { Component, Input, OnInit } from '@angular/core';
import { Ad, Company } from 'src/app/company/company.page';
import { CompanyService } from 'src/app/_services/company.service';


@Component({
  selector: 'app-ad-slides',
  templateUrl: './ad-slides.component.html',
  styleUrls: ['./ad-slides.component.scss'],
})
export class AdSlidesComponent implements OnInit {

  @Input() ads: Ad[];
  @Input() company: Company;

  sponsorAds: boolean = true;
  activeAds: Ad[];
  
  slideOpts = {
    slidesPerView: 4
  };

  constructor(
    private companyServ: CompanyService
  ) { }

  ngOnInit() {
    this.setSponsorAds()
  }

  setSponsorAds() {
    this.companyServ.getUserCompany().then((company) => {
      console.log("User company: ", company, "Ads: ", this.ads, "Ad Company: ", this.company)
      if (company.id === this.company.id) {
        this.sponsorAds = false
        this.activeAds = this.ads
      } else {
        this.activeAds = this.ads.filter((ad) => ad.active)
      }
    }).catch((err) =>{
      console.error(err)
      this.activeAds = this.ads.filter((ad) => ad.active)
    })
  }
}
