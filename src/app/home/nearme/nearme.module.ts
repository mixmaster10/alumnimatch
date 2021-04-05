import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NearmePage } from './nearme.page';
import { DirectivesModule } from 'src/app/_directives/directives.module';
import { SharedModule } from 'src/app/_shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import { AgmOverlays } from 'agm-overlays';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { environment } from 'src/environments/environment';

const routes: Routes = [
  {
    path: '',
    component: NearmePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    DirectivesModule,
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLEMAP_APIKEY,
      libraries: ['places']
    }),
    AgmOverlays,
    AgmJsMarkerClustererModule,
    SharedModule
  ],
  declarations: [NearmePage]
})
export class NearmePageModule {}
