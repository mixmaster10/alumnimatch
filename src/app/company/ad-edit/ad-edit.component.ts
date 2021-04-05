import { formatDate } from '@angular/common';
import { getAttrsForDirectiveMatching } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/_services/api.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { AdOptionsComponent } from '../ad-options/ad-options.component';
import { Ad, Company } from '../company.page';

@Component({
  selector: 'app-ad-edit',
  templateUrl: './ad-edit.component.html',
  styleUrls: ['./ad-edit.component.scss'],
})
export class AdEditComponent implements OnInit {

  isLoading = false;
  isError = false;
  isSubmitting: boolean = false;

  newAd: boolean = true;
  ad: Ad;
  company: Company;
  leadsToAdd: number = 0;
  uploadPhoto: boolean = false;
  imageData: any;

  constructor(
    private utils: UtilsService, 
    private navCtrl: NavController,
    private toastController: ToastController,
    private popoverCtrl: PopoverController,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.company = history.state.company

    if (history.state.ad) {
      this.ad = history.state.ad
      this.newAd = false
    }
  }

  selectAudience() {
    console.log('Select Audience')
  }
  
  _handleInputChange(e: any) {
    let value = e.target.value;
    let name = e.target.name;
    if (name !== 'leadsToAdd') {
      this.ad = { ...this.ad, [name]: value };
    } else {
      this.leadsToAdd = Number(value)
    }
  }

  async presentOptionsPopover(event: Event) {
    
    const popover = await this.popoverCtrl.create({
      component: AdOptionsComponent,
      componentProps: {ad: this.ad, company: this.company},
      event,
      translucent: true,
      backdropDismiss: true
    });
    await popover.present();
  }

  toggleActive(e: any) {
    console.log(e)
    this.ad = {...this.ad, active: e}
  }

  takePhoto() {
    this.utils
      .takePhoto(true)
      .then(async (imageData) => {
        this.ad.photoUrl = 'data:image/jpeg;base64,' + imageData;

        this.uploadPhoto = true
        this.imageData = imageData

      })
      .catch((err) => {
        console.error('err', err);
        this.presentToast('Error: Could not upload photo', false)
      })
  }

  /* async purchaseLeads() {
    console.log('Purchase leads')
    await this.navCtrl.navigateForward('/payment', {state: {company: this.company, pageAfterPayment: '/company/ad-edit'}})
  } */

  async handleRequest() {
    if (this.newAd) {
      this.api.post(`ads/${this.company.id}`, this.ad).subscribe(async (res: any) => {
        console.log(res)
        if (res) {
          this.ad = res
          console.log(this.ad)
          if (this.uploadPhoto) {
            this.api.post(`ads/photo/${this.ad.id}`, {photo: this.imageData}).subscribe(async (res: any) => {
              console.log(res);
              this.ad.photoUrl = res + '?' + (new Date().getTime());

              this.presentToast('Successfully created the ad', true)
              if (this.leadsToAdd > 0) {
                console.log("Updating company")
                await this.updateCompany()
              }
              this.newAd = false
              this.back(true)
            },
            ({ error }) => {
              console.error('api.post error for ads/photo', error);
              this.presentToast('Error: Could not upload photo.', false)
              this.isError = error.message;
            })
          } else {
            this.presentToast('Successfully created the ad', true)
            if (this.leadsToAdd > 0) {
              console.log("Updating company")
              await this.updateCompany()
            }
            this.newAd = false
            this.back(true)
          }
          
        }
      },
      ({ error }) => {
        console.error('api.post error for ads/company_id', error);
        this.presentToast('Ad could not be created. Please check all your fields and try again.', false);
        this.isSubmitting = false;
        this.isError = error.message;
      });
    } else {
      this.api.put(`ads/${this.ad.id}`, this.ad).subscribe(
        async (res: any) => {
          console.log(res);
          if (this.uploadPhoto) {
            this.api.post(`ads/photo/${this.ad.id}`, {photo: this.imageData}).subscribe(async (res: any) => {
              console.log(res);
              this.ad.photoUrl = res + '?' + (new Date().getTime());

              this.presentToast('Successfully updated the ad', true)
              this.isSubmitting = false;
              
              const index = this.company.ads.findIndex((ad) => ad.id === this.ad.id)
              this.company.ads.splice(index, 1, this.ad)
              
              if (this.leadsToAdd > 0) {
                console.log("Updating company")
                await this.updateCompany()
              }

              console.log("Company before returning", JSON.stringify(this.company))
              this.back(true)
            },
            ({ error }) => {
              console.error('api.post error for ads/photo', error);
              this.presentToast('Error: Could not upload photo.', false)
              this.isError = error.message;
            })
          } else {
            this.presentToast('Successfully updated the ad', true)
            this.isSubmitting = false;

            const index = this.company.ads.findIndex((ad) => ad.id === this.ad.id)
            this.company.ads[index] = this.ad

            if (this.leadsToAdd > 0) {
              console.log("Updating company")
              await this.updateCompany()
            }
            this.back(true)
          }

          
        },
        ({ error }) => {
          console.error('api.put error for ads/ad.id', error);
          this.presentToast('Ad could not be updated. Please check all your fields and try again.', false);
          this.isSubmitting = false;
          this.isError = error.message;
        }
      );
    }
  }

  async saveDetails() {
    console.log('Saving Details')
    this.isSubmitting = true;

    if (this.validateData()) { // store company details in ad & take out leadsToAdd from balance
      if (this.leadsToAdd > 0) {  
        this.company.leadsBalance -= this.leadsToAdd
      }
      
      this.ad.leadsRemaining = (this.ad.leadsRemaining ? this.ad.leadsRemaining as number : 0) as number + this.leadsToAdd as number
      this.ad.totalLeads = ((this.ad.totalLeads ? this.ad.totalLeads as number : 0) as number) + (this.leadsToAdd as number)
      this.ad.leadsUsed = this.ad.leadsUsed ? this.ad.leadsUsed : {}

      this.ad = {
        ...this.ad, 
        active: this.ad.active ? this.ad.active : false,
        company_id: this.company.id,
        companyName: this.company.companyName
      }
      
      console.log(this.ad, this.company)
      
      await this.handleRequest()
    } else {
      this.isSubmitting = false
    }
  }

  validateData(): boolean {
    if (!this.ad.title || this.ad.title === '') {
      this.presentToast('Please enter a title.', false)
      return false
    } else if (!this.ad.description || this.ad.description === '') {
      this.presentToast('Please enter a description.', false)
      return false
    } else if (this.leadsToAdd > this.company.leadsBalance) {
      this.presentToast(`Insufficient leads balance. Please purchase more.`, false)
    } else {
      return true
    }
  }

  async updateCompany() {
    if (this.leadsToAdd > 0) {
      this.api.put(`user/company/${this.company.id}`, this.company).subscribe((res: any) => {
        //this.presentToast('Successfully created the ad', true);
        this.isSubmitting = false;
        //this.back()
      },
      ({ error }) => {
        console.error('api.put error for user/company', error);
        this.isSubmitting = false;
        this.isError = error.message;
      });
    }
  }

  async presentToast(message: string, success: boolean) {
    const toast = await this.toastController.create({
      message: message,
      color: success ? 'success' : 'danger',
      duration: 2000,
      position: 'middle',
    });
    await toast.present();
  }

  back(saved?: boolean) {
    if (saved) {
      this.navCtrl.navigateBack('/company', {state: {company: this.company}})
    } else {
      this.navCtrl.navigateBack('/company')
    }
  }
}
