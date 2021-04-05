import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CompanyPage } from './company.page';
import { DirectivesModule } from 'src/app/_directives/directives.module';
import { SharedModule } from 'src/app/_shared/shared.module';
import { PipesModule } from 'src/app/_pipes/pipes.module';
import { CompanyEditComponent } from './company-edit/company-edit.component';
import { AdEditComponent } from './ad-edit/ad-edit.component';
import { AdOptionsComponent } from './ad-options/ad-options.component';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { AdDataComponent } from './ad-data/ad-data.component';

const routes: Routes = [
  {
    path: '',
    component: CompanyPage
  },
  {
    path: 'edit',
    component: CompanyEditComponent
  },
  {
    path: 'ad-edit',
    component: AdEditComponent
  }, {
    path: 'ad-data',
    component: AdDataComponent
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
    PipesModule,
    NgxLinkifyjsModule
  ],
  declarations: [CompanyPage, CompanyEditComponent, AdEditComponent, AdOptionsComponent, AdDataComponent],
  entryComponents: [CompanyEditComponent, AdEditComponent, AdOptionsComponent, AdDataComponent]
})
export class CompanyPageModule {}
