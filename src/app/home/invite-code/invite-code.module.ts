import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InviteCodePage } from './invite-code.page';
import { DirectivesModule } from 'src/app/_directives/directives.module';

const routes: Routes = [
  {
    path: '',
    component: InviteCodePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    DirectivesModule
  ],
  declarations: [InviteCodePage]
})
export class InviteCodePageModule {}
