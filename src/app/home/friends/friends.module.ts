import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FriendsPage } from './friends.page';
import { SharedModule } from 'src/app/_shared/shared.module';
import { DirectivesModule } from 'src/app/_directives/directives.module';
import { PipesModule } from 'src/app/_pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: FriendsPage
  },
  {
    path: ':segment',
    component: FriendsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
    DirectivesModule,
    PipesModule
  ],
  declarations: [
    FriendsPage
  ]
})
export class FriendsPageModule {}
