import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LeaderboardPage } from './leaderboard.page';
import { DirectivesModule } from 'src/app/_directives/directives.module';
import { SharedModule } from 'src/app/_shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: LeaderboardPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    DirectivesModule,
    SharedModule
  ],
  declarations: [LeaderboardPage]
})
export class LeaderboardPageModule {}
