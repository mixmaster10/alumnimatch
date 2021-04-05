import { Injectable } from '@angular/core';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';
import { Ad, Company } from '../company/company.page';
import { ApiService } from './api.service';
import { UtilsService } from './utils.service';


//const stripeJs = loadStripe(environment.STRIPE_APIKEY, {apiVersion: '2020-08-27'})

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
    
    constructor() {}

    // async purchaseCompanyPage(cancel_url: string, success_url: string) {
    //     // create company in stripe and redirect them to a checkout session for payment
    //     this.api.post('checkout/company', {cancel_url, success_url, product: 'company_product_in_stripe'}, true).subscribe(async (res: any) => {
    //         console.log("Stripe checkout result", JSON.stringify(res))
    //         await this.toCheckout(res.id)
    //     }, (err) => {
    //         console.log(JSON.stringify(err))
    //         this.utilServ.presentErrorAlert('Unable to create stripe checkout session')
    //     })
    // }

    // async pruchaseLeads(cancel_url: string, success_url: string, leads: number) {
    //     // this.stripeJS = await loadStripe(environment.STRIPE_APIKEY, {apiVersion: '2020-08-27'})

    //     this.api.post('checkout/leads', {cancel_url, success_url, quantity: leads/10}, true).subscribe(async (res: any) => {
    //         console.log("Stripe checkout result", JSON.stringify(res))
    //         await this.toCheckout(res.id)
    //     }, (err) => {
    //         console.log(JSON.stringify(err))
    //         this.utilServ.presentErrorAlert('Unable to create stripe checkout session')
    //     })

    //     // create checkout session and redirect
    //     /* this.api.post('checkout/leads', {cancel_url, success_url, product: 'leads_product', quantity: leads/10}, true).subscribe(async (res: any) => {
    //         console.log("Stripe checkout result", res)
    //         await this.toCheckout(res.id)
    //     }, (err) => {
    //         console.log(err)
    //         this.utilServ.presentErrorAlert('Unable to create stripe checkout session')
    //     }) */
    // }

    /* async toCheckout(sessionId: string) {

        await (await stripeJs).redirectToCheckout({sessionId}).catch((err) => {
            console.error('Redirect to Checkout Error: ', JSON.stringify(err))
        })
    } */

}
