import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SearchPage } from './search.page';
import { PipesModule } from 'src/app/_pipes/pipes.module';
import { DirectivesModule } from 'src/app/_directives/directives.module';
import { SharedModule } from 'src/app/_shared/shared.module';
import { SearchResultModalComponent } from './search-result-modal/search-result-modal.component';

const routes: Routes = [
  {
    path: '',
    component: SearchPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule,
    DirectivesModule,
    SharedModule
  ],
  declarations: [SearchPage, SearchResultModalComponent],
  entryComponents: [SearchResultModalComponent]
})
export class SearchPageModule {}
