import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SelectModalComponent } from './select-modal/select-modal.component';
import { DirectivesModule } from '../_directives/directives.module';
import { PickLocationModalComponent } from './pick-location-modal/pick-location-modal.component';
import { environment } from 'src/environments/environment';
import { AgmCoreModule } from '@agm/core';
import { PipesModule } from '../_pipes/pipes.module';

import { AlumniSlidesComponent } from './alumni-slides/alumni-slides.component';
import { AlumniSmComponent } from './alumni-sm/alumni-sm.component';
import { MessageComponent } from './message/message.component';
import { AlumniComponent } from './alumni/alumni.component';
import { LocationOptionModalComponent } from './location-option-modal/location-option-modal.component';
import { SendMessageModalComponent } from './send-message-modal/send-message-modal.component';
import { DetailMessageModalComponent } from './detail-message-modal/detail-message-modal.component';
import { AlumniLoadingComponent } from './alumni-loading/alumni-loading.component';
import { AlumniModalComponent } from './alumni-modal/alumni-modal.component';
import { SelectAlumniModalComponent } from './select-alumni-modal/select-alumni-modal.component';
import { LoadingComponent } from './loading/loading.component';
import { AdComponent } from './ad/ad.component';
import { AdSlidesComponent } from './ad-slides/ad-slides.component';
import { AdSmComponent } from './ad-sm/ad-sm.component'
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { QuestionsComponent } from '../auth/questions/questions.component';
import { SearchModalComponent } from './search-modal/search-modal.component';
import { SponsorComponent } from './sponsor/sponsor.component';
import { MoreInfoComponent } from './more-info/more-info.component'

@NgModule({
  declarations: [
    SelectModalComponent,
    PickLocationModalComponent,
    MoreInfoComponent,
    AlumniSlidesComponent,
    AlumniSmComponent,
    MessageComponent,
    AlumniComponent,
    LocationOptionModalComponent,
    SendMessageModalComponent,
    DetailMessageModalComponent,
    AlumniLoadingComponent,
    AlumniModalComponent,
    SelectAlumniModalComponent,
    QuestionsComponent,
    LoadingComponent,
    AdComponent,
    SponsorComponent,
    AdSlidesComponent,
    AdSmComponent,
    SearchModalComponent,
    SponsorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DirectivesModule,
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLEMAP_APIKEY,
      libraries: ['places'],
    }),
    PipesModule,
    NgxLinkifyjsModule
  ],
  entryComponents: [   
    AdComponent,
    SelectModalComponent,
    SearchModalComponent,
    PickLocationModalComponent,
    MoreInfoComponent, 
    LocationOptionModalComponent, 
    SendMessageModalComponent, DetailMessageModalComponent,
    AlumniModalComponent,
    SelectAlumniModalComponent
  ],
  exports: [
    SelectModalComponent,
    PickLocationModalComponent,
    MoreInfoComponent,
    AlumniSlidesComponent,
    AlumniSmComponent,
    MessageComponent,
    AlumniComponent,
    LocationOptionModalComponent,
    SendMessageModalComponent,
    DetailMessageModalComponent,
    AlumniLoadingComponent,
    AlumniModalComponent,
    QuestionsComponent,
    SelectAlumniModalComponent,
    LoadingComponent,
    AdComponent,
    AdSlidesComponent,
    AdSmComponent,
    SearchModalComponent,
    SponsorComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
