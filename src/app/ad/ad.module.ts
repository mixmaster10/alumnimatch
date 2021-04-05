import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdPage } from './ad.page';
import { DirectivesModule } from 'src/app/_directives/directives.module';
import { SharedModule } from 'src/app/_shared/shared.module';
import { PipesModule } from 'src/app/_pipes/pipes.module';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { InterestedInputComponent } from '../_shared/interested-input/interested-input.component';

const routes: Routes = [
  {
    path: '',
    component: AdPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    NgxLinkifyjsModule,
    DirectivesModule,
    SharedModule,
    PipesModule
  ],
  declarations: [AdPage, InterestedInputComponent],
  entryComponents: [InterestedInputComponent]
})
export class AdPageModule {}
