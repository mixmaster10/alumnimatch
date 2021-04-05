import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SponsorPage } from './sponsor.page';
import { DirectivesModule } from 'src/app/_directives/directives.module';
import { SharedModule } from 'src/app/_shared/shared.module';
import { PipesModule } from 'src/app/_pipes/pipes.module';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';

const routes: Routes = [
  {
    path: '',
    component: SponsorPage
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
  declarations: [SponsorPage]
})
export class SponsorPageModule {}
