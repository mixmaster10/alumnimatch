import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/_services/api.service';
import {
  WORK_FORS,
  EMPLOYMENT_STATUSES,
  WORK_TITLES,
  HIRE_FORS,
  GIG_PROJECTS,
  HIRE_MONTHLY,
  OWN_BUSINESSES,
  BUYING_STUFFS,
  CUSTOMERS,
  WEALTHS,
  REVIEW_PLANS
} from 'src/app/_config/current-life.constant';
import { PickLocationModalComponent } from 'src/app/_shared/pick-location-modal/pick-location-modal.component';
import { SelectModalComponent } from 'src/app/_shared/select-modal/select-modal.component';
import { INDUSTRIES } from 'src/app/_config/industries.constant';
import { UtilsService } from 'src/app/_services/utils.service';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-cl-work-career',
  templateUrl: './cl-work-career.component.html',
  styleUrls: ['./cl-work-career.component.scss'],
})
export class ClWorkCareerComponent implements OnInit {

  data: any = {};

  work_fors = WORK_FORS;
  selectWorkForOption: any = {
    header: 'Select type',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  employment_statuses = EMPLOYMENT_STATUSES;
  selectEmploymentStatusOption: any = {
    header: 'Select status',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  work_titles = WORK_TITLES;
  selectWorkTItleOption: any = {
    header: 'Select title at work',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  hire_monthly = HIRE_MONTHLY;
  selectHireCountOption: any = {
    header: 'Select counts',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  hire_fors = HIRE_FORS;
  selectHireForOption: any = {
    header: 'Are you hiring for...',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  gig_projects = GIG_PROJECTS;
  selectGIGCountOption: any = {
    header: 'Select counts',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  own_businesses = OWN_BUSINESSES;
  selectOwnBusinessOption: any = {
    header: 'Have you ever wanted to own your own business?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  buying_stuffs = BUYING_STUFFS;
  selectStuffOption: any = {
    header: 'Select buying stuff',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  customers = CUSTOMERS;
  selectCustomerOption: any = {
    header: 'Select kind of customer',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  ALL_INDUSTRIES = INDUSTRIES;
  selectNetWealthOption: any = {
    header: 'Select your net wealth category',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  wealths = WEALTHS;
  selectReviewPlanOption: any = {
    header: 'Select reviewing business plans',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  review_plans = REVIEW_PLANS;

  verified = true;

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private utilServ: UtilsService,
    private dataServ: DataService
  ) { }

  ngOnInit() {
    if (localStorage.verified) {
      this.verified = true;
    } else {
      this.verified = false;
    }
    this.getWorkCareer();
  }

  getWorkCareer() {
    this.api.get('user/work-career', true).subscribe((res) => {
      console.log('user/work-career', JSON.stringify(res));
      this.data = res;
    }, (err) => {
      console.error('user/work-career', err);
    });
  }

  removeBuyItem(buyIndex: number) {
    this.data.buying_stuff = this.data.buying_stuff.filter((stuff: number) => stuff !== buyIndex)
  }

  removeSellItem(sellIndex: number) {
    this.data.customer = this.data.customer.filter((stuff: number) => stuff !== sellIndex)
  }

  async addCity(type: any) {
    const modal = await this.modalCtrl.create({
      component: PickLocationModalComponent,
      backdropDismiss: false
    });
    modal.onWillDismiss().then((result) => {
      if (result && result.data) {
        console.log('result', result.data);
        const position = {
          country: result.data.country,
          state: result.data.state,
          city: result.data.city
        };
        switch (type) {
          case 'business':
            if (this.data.business_cities) {
              this.data.business_cities.push(position);
            } else {
              this.data.business_cities = [position];
            }
            break;
          case 'travel':
            if (this.data.travel_cities) {
              this.data.travel_cities.push(position);
            } else {
              this.data.travel_cities = [position];
            }
            break;
          default:
            break;
        }
      }
    });
    return await modal.present();
  }

  async selectIndustry(index) {
    let industries = []

    if (this.data.industries) {
      for (let industry of this.data.industries) {
        industries.push(industry)
      }
    }

    console.log(`Industry's data: ${JSON.stringify(this.data)} - Industries selected: ${JSON.stringify(industries)}`)

    const modal = await this.modalCtrl.create({
      component: SelectModalComponent,
      componentProps: {
        items: this.ALL_INDUSTRIES,
        selectedItem: industries.length > 0 ? industries : null,
        multiple: true,
        title: 'Select industry'
      },
      cssClass: 'select-modal-css',
      backdropDismiss: false
    });
    modal.onDidDismiss().then((res) => {
      console.log('chooseIndustry', JSON.stringify(res));

      if (res.data) {
        if (industries.length > 0) {
          for (const industry of res.data) {
            if (!this.data.industries.find(pieceOfData => pieceOfData.id === industry.id)) {
              this.data.industries.push(industry)
            }
          }

          this.data.industries = this.data.industries.filter(pieceOfData => res.data.find(industry => industry.id === pieceOfData.id) != null )
        } else {
          this.data.industries = res.data
          console.log(`Industries length is 0`)
        }
      } else {
        console.log(`Cancelled selection`)
      }
    }).catch((err) => {
      console.error('chooseIndustry', err);
    });
    return await modal.present();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onSubmit() {
    if (this.validData()) {
      this.api.post('user/work-career', this.data, true).subscribe((res) => {
        console.log('user/work-career', res);
        this.modalCtrl.dismiss({success: true});
        this.dataServ.updateUserData({cl: {work: this.data}})

      }, (err) => {
        console.error('user/work-career', err);
        if ( err.status >= 200 && err.status <= 299) {
          this.modalCtrl.dismiss({success: true})
        } 
      });
    }
  }

  validData() {
    if (this.data.work_title === undefined) {
      this.utilServ.presentErrorAlert("Please select a work title.")
      return false
    }

    return true
  }

}
