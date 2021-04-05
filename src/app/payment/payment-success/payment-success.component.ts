import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Company } from 'src/app/company/company.page';
import { ApiService } from 'src/app/_services/api.service';
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss'],
})
export class PaymentSuccessComponent implements OnInit {

  purchaseDescription: string;
  quantity: number;
  product: string;
  company: Company;

  constructor(
    private navCtrl: NavController, 
    private route: ActivatedRoute,
    private api: ApiService,
    private utilServ: UtilsService
  ) { }

  ngOnInit() {
    console.log(this.route.snapshot.queryParams)
    this.quantity = this.route.snapshot.queryParams.quantity
    this.product = this.route.snapshot.queryParams.product
    
    
    this.updateCompany()
  }

  async updateCompany() {
    this.api.get('user/company').subscribe((res: any) => {
      console.log('getCompanyData', res.companies[0]);

      if (res) {
        this.company = res.companies[0];
        if (this.product === 'company' && !this.company.paid) {
          this.purchaseDescription = `You've successfully purchased your company page! We added 10 leads to your account.`
          this.company.paid = true
          this.company.leadsBalance += 10 * this.quantity
        } else if (this.product === 'company' && this.company.paid) {
          this.purchaseDescription = `You've already purchased your company page and the leads have already been added to your account`
        } else {
          this.purchaseDescription = `You've successfully purchased ${this.quantity * 10} leads! They've been added to your account.`
          this.company.leadsBalance += 10 * this.quantity
        }
        
        
        this.api.put(`user/company/${this.company.id}`, {...this.company}).subscribe(
          (res: any) => {
            console.log("Update company", res);
            this.utilServ.presentToast('Your company has successfully been updated!')

          },
          ({ error }) => {
            this.utilServ.presentToast('An error occurred updating your info. Please contact support.')
            console.error('api.post error for user/company', error);

          }
        );
      } else {
        console.error('No company to apply purchase to')
      }
      
    }, (err) => {
      console.error('Company Data: ', err);
    });
  }

  redirectToPreviousPage() {
    console.log(this.route.params, this.route)
    const path = localStorage.getItem('pageAfterPayment')
    localStorage.removeItem('pageAfterPayment')
    this.navCtrl.navigateBack(path)
  }

}
