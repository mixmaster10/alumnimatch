import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PaymentPage } from './payment.page';

import { DirectivesModule } from 'src/app/_directives/directives.module';
import { SharedModule } from 'src/app/_shared/shared.module';
import { PipesModule } from 'src/app/_pipes/pipes.module';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentFailedComponent } from './payment-failed/payment-failed.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentPage
  },
  {
    path: 'success',
    component: PaymentSuccessComponent
  },
  {
    path: 'failed',
    component: PaymentFailedComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    DirectivesModule,
    SharedModule,
    PipesModule
  ],
  declarations: [PaymentPage, PaymentSuccessComponent, PaymentFailedComponent],
  entryComponents: [PaymentSuccessComponent, PaymentFailedComponent]
})
export class PaymentPageModule {}
