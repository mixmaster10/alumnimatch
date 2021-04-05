import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-payment-failed',
  templateUrl: './payment-failed.component.html',
  styleUrls: ['./payment-failed.component.scss'],
})
export class PaymentFailedComponent implements OnInit {

  constructor(private navCtrl: NavController,
    ) { }

  ngOnInit() {}

  redirectToPreviousPage() {
    const path = localStorage.getItem('pageAfterPayment')
    localStorage.removeItem('pageAfterPayment')
    this.navCtrl.navigateBack(path)
  }

}
