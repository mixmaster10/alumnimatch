import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import { PastSchoolComponent } from './past-school/past-school.component';
import { CurrentLifeComponent } from './current-life/current-life.component';
import { SharedModule } from '../_shared/shared.module';
import { PsAthleteComponent } from './_components/ps-athlete/ps-athlete.component';
import { PsDegreeComponent } from './_components/ps-degree/ps-degree.component';
import { PsOrgComponent } from './_components/ps-org/ps-org.component';
import { PsCollegesComponent } from './_components/ps-colleges/ps-colleges.component';
import { DirectivesModule } from '../_directives/directives.module';
import { ClReligionModalComponent } from './_components/cl-religion-modal/cl-religion-modal.component';
import { ClSpeakLanguagesComponent } from './_components/cl-speak-languages/cl-speak-languages.component';
import { ClGenderAgeEthnicityComponent } from './_components/cl-gender-age-ethnicity/cl-gender-age-ethnicity.component';
import { ClLearnLanguageComponent } from './_components/cl-learn-language/cl-learn-language.component';
import { ClRelationshipComponent } from './_components/cl-relationship/cl-relationship.component';
import { ClRelationshipInviteModalComponent } from './_components/cl-relationship-invite-modal/cl-relationship-invite-modal.component';
import { ClWorkCareerComponent } from './_components/cl-work-career/cl-work-career.component';
import { ClHomeBaseLocationComponent } from './_components/cl-home-base-location/cl-home-base-location.component';
import { ClHometownComponent } from './_components/cl-hometown/cl-hometown.component';
import { ClHobbiesComponent } from './_components/cl-hobbies/cl-hobbies.component';
import { ClCausesComponent } from './_components/cl-causes/cl-causes.component';
import { ClSchoolQuestionsComponent } from './_components/cl-school-questions/cl-school-questions.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { PipesModule } from '../_pipes/pipes.module';
import { SimilarUsersModalComponent } from './_components/similar-users-modal/similar-users-modal.component';
import { ActivityQuestionsComponent } from './_components/activity-questions/activity-questions.component';

const routes: Routes = [
      {
        path: '',
        component: ProfilePage
      },
      {
        path: 'past-school',
        component: PastSchoolComponent
      },
      {
        path: 'current-life',
        component: CurrentLifeComponent
      },
      {
        path: 'view',
        component: ViewProfileComponent
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
    PipesModule
  ],
  declarations: [
    ProfilePage,
    PastSchoolComponent,
    CurrentLifeComponent,
    PsAthleteComponent,
    PsDegreeComponent,
    PsOrgComponent,
    PsCollegesComponent,
    ClGenderAgeEthnicityComponent,
    ClSpeakLanguagesComponent,
    ClLearnLanguageComponent,
    ClReligionModalComponent,
    ClRelationshipComponent,
    ClRelationshipInviteModalComponent,
    ClWorkCareerComponent,
    ClHomeBaseLocationComponent,
    ClHometownComponent,
    ClHobbiesComponent,
    ClCausesComponent,
    ActivityQuestionsComponent,
    ClSchoolQuestionsComponent,
    ViewProfileComponent,
    SimilarUsersModalComponent
  ],
  entryComponents: [
    PsAthleteComponent,
    PsDegreeComponent,
    PsOrgComponent,
    PsCollegesComponent,
    ClGenderAgeEthnicityComponent,
    ClSpeakLanguagesComponent,
    ClLearnLanguageComponent,
    ClReligionModalComponent,
    ClRelationshipComponent,
    ClRelationshipInviteModalComponent,
    ClWorkCareerComponent,
    ClHomeBaseLocationComponent,
    ClHometownComponent,
    ClHobbiesComponent,
    ClCausesComponent,
    ActivityQuestionsComponent,
    ClSchoolQuestionsComponent,
    SimilarUsersModalComponent
  ]
})
export class ProfilePageModule {}
