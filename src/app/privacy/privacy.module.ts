import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PrivacyPage } from './privacy.page';
import { DirectivesModule } from '../_directives/directives.module';

const routes: Routes = [
  {
    path: '',
    component: PrivacyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    DirectivesModule
  ],
  declarations: [PrivacyPage]
})
export class PrivacyPageModule {}
