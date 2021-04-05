import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewSponsorsPage } from './view-sponsors.page';
import { SponsorPage } from '../sponsor.page';
import { SharedModule } from 'src/app/_shared/shared.module';
import { DirectivesModule } from 'src/app/_directives/directives.module';
import { PipesModule } from 'src/app/_pipes/pipes.module';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { SponsorComponent } from 'src/app/_shared/sponsor/sponsor.component';

import { ViewSponsorRoutingModule } from './view-sponsors-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewSponsorRoutingModule,
    SharedModule,
    DirectivesModule,
    PipesModule,
    NgxLinkifyjsModule,
    SharedModule,
    DirectivesModule,
    PipesModule
  ],
  declarations: [ViewSponsorsPage]
})
export class ViewSponsorsPageModule {}
