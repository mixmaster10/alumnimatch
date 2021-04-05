import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserPage } from './user.page';
import { SharedModule } from 'src/app/_shared/shared.module';
import { DirectivesModule } from 'src/app/_directives/directives.module';
import { PipesModule } from 'src/app/_pipes/pipes.module';
import { UserOptionsComponent } from './user-options/user-options.component';

const routes: Routes = [
  {
    path: ':uid',
    component: UserPage
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
  declarations: [UserPage, UserOptionsComponent],
  entryComponents: [UserOptionsComponent]
})
export class UserPageModule {}
