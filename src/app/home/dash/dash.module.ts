import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { Dashboard } from './dash.page';
import { DirectivesModule } from 'src/app/_directives/directives.module';
import { SharedModule } from 'src/app/_shared/shared.module';
import { PipesModule } from 'src/app/_pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: Dashboard
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
  declarations: [Dashboard]
})
export class DashboardModule {}
