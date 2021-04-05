import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AuthPage } from './auth.page';
import { AuthHomeComponent } from './auth-home/auth-home.component';
import { LoginComponent } from './login/login.component';
import { JoinComponent } from './join/join.component';
import { SocialButtonsComponent } from './_components/social-buttons/social-buttons.component';
import { VerifyCodeComponent } from './verify-code/verify-code.component';
import { ChooseCollegeComponent } from './choose-college/choose-college.component';
import { SharedModule } from '../_shared/shared.module';
import { AuthGuard } from '../_guards/auth.guard';
import { FinalComponent } from './final/final.component';
import { InactiveAccountComponent } from './inactive-account/inactive-account.component';
import { DirectivesModule } from '../_directives/directives.module';
import { NamesComponent } from './_components/names/names.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { Step1Component } from './step1/step1.component';

const routes: Routes = [
  {
    path: '',
    component: AuthPage,
    children: [
      {
        path: '',
        component: AuthHomeComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'join',
        component: JoinComponent
      },
      {
        path: 'verify-code/:social',
        component: VerifyCodeComponent
      },
      {
        path: 'questions',
        component: Step1Component
      },
      {
        path: 'choose-college',
        component: ChooseCollegeComponent
      },
      {
        path: 'final',
        component: FinalComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'inactive',
        component: InactiveAccountComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
    DirectivesModule,
    AngularFireAuthModule
  ],
  declarations: [
    AuthPage,
    AuthHomeComponent,
    LoginComponent,
    JoinComponent,
    VerifyCodeComponent,
    ChooseCollegeComponent,
    Step1Component,
    SocialButtonsComponent,
    FinalComponent,
    InactiveAccountComponent,
    NamesComponent
  ],
  entryComponents: [
    NamesComponent
  ]
})
export class AuthPageModule {}
