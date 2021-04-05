import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, PickerController, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Company } from '../company/company.page';
import { ApiService } from '../_services/api.service';
import { Stripe } from 'stripe'
import { PaymentService } from '../_services/payment.service';
import { loadStripe } from '@stripe/stripe-js'

const stripe = loadStripe(environment.STRIPE_APIKEY)
@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  leadsOptions: {text: string, value: number}[] = [{text: '10', value: 10}, {text: '20', value: 20}, {text: '30', value: 30}, {text: '40', value: 40}, {text: '50', value: 50}, {text: '60', value: 60}, {text: '70', value: 70}, {text: '80', value: 80}, {text: '90', value: 90}, {text: '100', value: 100}, {text: '110', value: 110}, {text: '120', value: 120}, {text: '130', value: 130}, {text: '140', value: 140}, {text: '150', value: 150}, {text: '160', value: 160}, {text: '170', value: 170}, {text: '180', value: 180}, {text: '190', value: 190}, {text: '200', value: 200}]
  code: string;
  company: Company;
  isError = false;
  isSubmitting: boolean = false;
  pageAfterPayment: string;
  product: string;
  //stripe = new Stripe('pk_test_51HZKL0KiR0tw86RIDUsmdg1hNmN42fc1zfdd1NW2I9uS5qln59znbt97oWfXsTRN3tTUzxZMroSR6JElU355epHl00Rj2OmD63', {apiVersion: '2020-08-27'})
  leads: number = 10
  cardComplete: boolean = false
  clientSecret: string;

  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    public toastController: ToastController, 
    private pickerController: PickerController,
    private route: ActivatedRoute,
    //private stripe: Stripe
  ) { 
    
  }

  ngOnInit() {
    this.company = history.state.company
    this.pageAfterPayment = history.state.pageAfterPayment
    this.product = history.state.product
    if (!this.pageAfterPayment) {
      this.navCtrl.navigateBack('/home')
      return;
    }
    // Api call to get client secret from server
    stripe.then((res) => {

      let card = res.elements().create("card");
      // Stripe injects an iframe into the DOM  
      card.mount("#card-element");

      card.on("change", (event) => {
        // Disable the Pay button if there are no card details in the Element
        this.cardComplete = event.complete;
        document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
      });

      var form = document.getElementById("payment-form");
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        // Complete payment when the submit button is clicked
        this.payWithCard(res, card); 
      });
    })
  }

  payWithCard(stripe, card) {
    this.loading(true);
    if (this.product === 'company') {
      this.api.post('checkout/company', {amount: 900}).subscribe(
        (res: any) => {
          console.log(JSON.stringify(res));
           
          stripe.confirmCardPayment(res.client_secret, {
              payment_method: {
                card: card
              }
          }).then((result) => {
              if (result.error) {
                // Show error to your customer
                this.showError(result.error.message);
              } else {
                // The payment succeeded!
                this.orderComplete(result.paymentIntent.id);
              }
            });
        }, ({ error }) => {
          console.error('api.post error for checkout/company', error);
        }
      );
    } else {
      this.api.post('checkout/leads', {amount: this.leads * 50}).subscribe(
        (res: any) => {
          console.log(JSON.stringify(res));
           
          stripe.confirmCardPayment(res.client_secret, {
              payment_method: {
                card: card
              }
          }).then((result) => {
              if (result.error) {
                // Show error to your customer
                this.showError(result.error.message);
              } else {
                // The payment succeeded!
                this.orderComplete(result.paymentIntent.id);
              }
            });
        }, ({ error }) => {
          console.error('api.post error for checkout/leads', error);
        }
      );
    }
    
  }

  // Shows a success message when the payment is complete
  orderComplete(paymentIntentId) {
    this.loading(false);
    document.querySelector(".result-message").classList.remove("hidden");
    document.querySelector("button").disabled = true;

    if (this.product === 'company') {
      if (!this.company.paid) {
        this.company.paid = true
      } 
      this.company.leadsBalance += 10
    } else if (this.product === 'leads' && this.company.paid) {
      this.company.leadsBalance += this.leads
    }
    

    this.saveDetails(true)
  };

  // Show the customer the error from Stripe if their card fails to charge
  showError(errorMsgText) {
    this.loading(false);
    var errorMsg = document.querySelector("#card-error");
    errorMsg.textContent = errorMsgText;
    setTimeout(() => {
      errorMsg.textContent = "";
    }, 4000);
  };

    // Show a spinner on payment submission
  loading(isLoading: boolean) {
    if (isLoading) {
      // Disable the button and show a spinner
      document.querySelector("button").disabled = true;
      document.querySelector("#spinner").classList.remove("hidden");
      document.querySelector("#button-text").classList.add("hidden");
    } else {
      document.querySelector("button").disabled = false;
      document.querySelector("#spinner").classList.add("hidden");
      document.querySelector("#button-text").classList.remove("hidden");
    }
  };

  async showPicker() {
    let options = {
      buttons: [
        {
          text: "Cancel",
          role: 'cancel'
        },
        {
          text:'Ok',
          handler: (result: any) => {
            console.log(result)
            this.leads = result.Leads.value
          }
        }
      ],
      columns:[{
        name:'Leads',
        options: this.leadsOptions
      }]
    };

    let picker = await this.pickerController.create(options);
    picker.present()
  }

  _handleInputChange(event: any) {
    this.code = event.target.value
  }

  applyCode() {
    console.log("apply code", this.code)
    if (this.validPromo()) {
      this.presentToast('Promo Applied!', true)
      if (!this.company.paid) {
        this.company.paid = true
      } 
      this.company.leadsBalance += 10

      this.saveDetails(true)

    } else {
      this.presentToast('Invalid promo', false)
    }
  }

  /* async goToCheckout() {
    //Redirect to stripe checkout
    localStorage.setItem('pageAfterPayment', this.pageAfterPayment)
    console.log(localStorage, this.route, window.location)
    
    if (this.product === 'leads') {
      // get product id of leads or send 'leads' to backend
      await this.paymentServ.pruchaseLeads(`${window.location.origin + (environment.production ? '/#' : '')}/payment/failed`, `${window.location.origin + (environment.production ? '/#' : '')}/payment/success`, this.leads)
    } else {
      await this.presentToast('Product not found', false)
    }
    
  } */

  saveDetails(promoUsed: boolean) {
    this.api.put(`user/company/${this.company.id}`, this.company).subscribe(
      (res: any) => {
        console.log(res);
        //this.presentToast(promoUsed ? 'Promo Applied! ' : 'Company Details Saved!' , true);
        this.isSubmitting = false;
        this.navCtrl.navigateBack(this.pageAfterPayment)
      },
      ({ error }) => {
        console.error('api.put error for user/company', error);
        alert("There was a problem saving your details. Please let us know.")
        this.isSubmitting = false;
        this.isError = error.message;
      }
    );
  }

  validPromo(): boolean {
    /* if (this.code === 'Paid') {
      return true
    } */
    return false
  }

  async presentToast(message: string, success: boolean) {
    const toast = await this.toastController.create({
      message: message,
      color: success ? 'success' : 'danger',
      duration: 3000,
      position: 'middle',
    });
    toast.present();
  }

  back() {
    history.back()
  }

  toSuccessPage() {
    //this.goToCheckout()
    this.navCtrl.navigateForward('/payment/success')
  }

  toFailedPage() {
    //this.goToCheckout()
    this.navCtrl.navigateForward('/payment/failed')
  }

}
