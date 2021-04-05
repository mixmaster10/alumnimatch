import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Company } from 'src/app/company/company.page';
import { ApiService } from 'src/app/_services/api.service';
import { DataService } from 'src/app/_services/data.service';
import { PaymentService } from 'src/app/_services/payment.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss'],
})
export class CompanyEditComponent implements OnInit {

  isLoading = false;
  isError = false;
  isSubmitting: boolean = false;
  verified = false;
  user: any;
  company: Company;
  uploadPhoto: boolean = false;
  imageData: any;
  
  constructor(
    private navCtrl: NavController,
    private utils: UtilsService, 
    public toastController: ToastController, 
    private api: ApiService,
    private dataServ: DataService
  ) { 
    
  }
  ngOnInit() {
    console.log(history.state)
    if (history.state.company) {
      this.company = history.state.company
      this.verified = this.company.paid || false
    } else {
      this.getCompanyData()
    }
    

    //this.user = history.state.user
  }

  getCompanyData() {

    this.api.get('user').subscribe((res: any) => {
      console.log('getUserData', res);
      if (res.user.company) {
        this.user = res.user
        this.company = res.user.company;
        this.verified = res.company.paid || false
      }
      
    }, (err) => {
      console.error(`Can't get Company Data`, err);
    });
  }

  async purchasePage() {
    const success = this.saveDetails(true)
    localStorage.setItem('pageAfterPayment', '/company')
    if (success) {
      console.log(success)
      await this.navCtrl.navigateForward('/payment', {state: {company: this.company, pageAfterPayment: '/company', product: 'company'}})
      //await this.paymentServ.purchaseCompanyPage(`${window.location.origin + (environment.production ? '/#' : '')}/payment/failed`, `${window.location.origin + (environment.production ? '/#' : '')}/payment/success?product=company`)
    }
  }

  async saveDetails(purchasePage?: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      console.log('Saving Details', this.company)
      this.isSubmitting = true;
  
      if (this.validateCompany()) {
        if (this.company.id > 0) {
          //let body = this.uploadPhoto ? {...this.company, photoUrl: ''} : this.company
          this.api.put(`user/company/${this.company.id}`, this.company).subscribe(
            (res: any) => {
              console.log("Put company details", res);
              this.presentToast(true);
              this.isSubmitting = false;
              this.company = res
              if (this.uploadPhoto) {
                this.api.post(`user/company/photo/${this.company.id}`, {photo: this.imageData}).subscribe((res: any) => {
                  console.log("Post company photo", JSON.stringify(res));
                  this.company.photoUrl = res + '?' + (new Date().getTime());
                  //this.dataServ.updateUserData({company: })
                  //this.presentToast('Photo successfully uploaded', true)
                },
                ({ error }) => {
                  console.error('api.post error for user/company/photo', JSON.stringify(error));
                  this.presentToast(false, 'Error: Could not upload photo.')
                  //this.isError = error.message;
                })
              }
  
              if (!purchasePage) {
                this.back();
              }
            },
            ({ error }) => {
              console.error('api.post error for user/company', error);
              this.isSubmitting = false;
              this.isError = error.message;
            }
          );
          resolve(true)
        } else {
          //let body = this.uploadPhoto ? {...this.company, paid: this.verified, photoUrl: ''} : {...this.company, paid: this.verified}
  
          //this.company = { ...this.company, id: this.user.id };
          this.api.post('user/company', {...this.company, paid: this.verified}).subscribe(
            (res: any) => {
              console.log(res);
              this.presentToast(true);
              this.isSubmitting = false;
              this.company = res
              if (this.uploadPhoto) {
                this.api.post(`user/company/photo/${this.company.id}`, {photo: this.imageData}).subscribe((res: any) => {
                  console.log(JSON.stringify(res));
                  this.company.photoUrl = res + '?' + (new Date().getTime());
                  //this.presentToast('Photo successfully uploaded', true)
                },
                ({ error }) => {
                  console.error('api.post error for user/company/photo', JSON.stringify(error));
                  this.presentToast(false, 'Error: Could not upload photo.')
                  //this.isError = error.message;
                })
              }
  
              if (!purchasePage) {
                this.back();
              }
            },
            ({ error }) => {
              console.error('api.post error for user/company', error);
              this.isSubmitting = false;
              this.isError = error.message;
            }
          );
          resolve(true)
        }
      } else {
        this.isSubmitting = false
        reject(false)
      }
    })
    
    
  }

  validateCompany(): boolean {
    if (!this.company.companyName || this.company.companyName === '') {
      this.presentToast(false, 'Please enter a company name.')
      return false
    } else if (!this.company.creatorTitle || this.company.creatorTitle === '') {
      this.presentToast(false, 'Please enter your title.')
      return false
    } else if (!this.company.description || this.company.description === '') {
      this.presentToast(false, 'Please enter a description.')
      return false
    } else if (!this.company.websiteLink || this.company.websiteLink === '') {
      this.presentToast(false, 'Please enter a web link.')
      return false
    } else {
      return true
    }
  }

  takePhoto() {

    this.utils.takePhoto().then((imageData) => {
      this.company.photoUrl = 'data:image/jpeg;base64,' + imageData;
      console.log(imageData)
      
      this.uploadPhoto = true
      this.imageData = imageData

    }).catch((err) => {
      console.error('err', err);
      this.presentToast(false, 'Photo could not be uploaded')

    });

  }

  async presentToast(success: boolean, message: string = 'Company Details Saved Successfully.') {
    const toast = await this.toastController.create({
      message: message,
      color: success ? 'success' : 'danger',
      duration: 2000,
      position: 'middle',
    });
    toast.present();
  }

  _handleInputChange(e: any) {
    let value = e.target.value;
    let name = e.target.name;
    this.company = { ...this.company, [name]: value };
  }

  back() {
    this.navCtrl.navigateBack('/company');
  }

}
