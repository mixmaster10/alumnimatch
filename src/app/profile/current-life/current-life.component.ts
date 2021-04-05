import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { ClReligionModalComponent } from '../_components/cl-religion-modal/cl-religion-modal.component';
import { ClGenderAgeEthnicityComponent } from '../_components/cl-gender-age-ethnicity/cl-gender-age-ethnicity.component';
import { ClSpeakLanguagesComponent } from '../_components/cl-speak-languages/cl-speak-languages.component';
import { ClLearnLanguageComponent } from '../_components/cl-learn-language/cl-learn-language.component';
import { ClRelationshipComponent } from '../_components/cl-relationship/cl-relationship.component';
import { ClWorkCareerComponent } from '../_components/cl-work-career/cl-work-career.component';
import { ClHomeBaseLocationComponent } from '../_components/cl-home-base-location/cl-home-base-location.component';
import { ClHometownComponent } from '../_components/cl-hometown/cl-hometown.component';
import { ClHobbiesComponent } from '../_components/cl-hobbies/cl-hobbies.component';
import { ClCausesComponent } from '../_components/cl-causes/cl-causes.component';
import { ClSchoolQuestionsComponent } from '../_components/cl-school-questions/cl-school-questions.component';
import { ApiService } from 'src/app/_services/api.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { ActivityQuestionsComponent } from '../_components/activity-questions/activity-questions.component';

@Component({
  selector: 'app-current-life',
  templateUrl: './current-life.component.html',
  styleUrls: ['./current-life.component.scss'],
})
export class CurrentLifeComponent implements OnInit {
  verified = true;
  completes: any;
  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private api: ApiService,
    private utils: UtilsService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (localStorage.verified) {
      this.verified = true;
    } else {
      this.verified = false;
    }
    this.getCLComplete();
  }

  getCLComplete() {
    this.api.get('user/completed/cl', true).subscribe((res) => {
      console.log('user/completed/cl', res);
      this.completes = res;
    }, (err) => {
      console.log('users/completed/cl', err);
    });
  }

  openSubProfile(key) {
    switch (key) {
      case 'gender-age-ethnicity':
        this.openSubProfileModal(ClGenderAgeEthnicityComponent, 'gae');
        break;
      case 'speak-language':
        this.openSubProfileModal(ClSpeakLanguagesComponent, 'speak');
        break;
      case 'learn-language':
        this.openSubProfileModal(ClLearnLanguageComponent, 'learn');
        break;
      case 'religion':
        this.openSubProfileModal(ClReligionModalComponent, 'religion');
        break;
      case 'relationship':
        this.openSubProfileModal(ClRelationshipComponent, 'relationship');
        break;
      case 'work-career':
        this.openSubProfileModal(ClWorkCareerComponent, 'career');
        break;
      case 'home':
        this.openSubProfileModal(ClHomeBaseLocationComponent, 'home');
        break;
      case 'hometown':
        this.openSubProfileModal(ClHometownComponent, 'hometown');
        break;
      case 'hobby':
        this.openSubProfileModal(ClHobbiesComponent, 'hobbies');
        break;
      case 'cause':
        this.openSubProfileModal(ClCausesComponent, 'causes');
        break;
      case 'school':
        this.openSubProfileModal(ClSchoolQuestionsComponent, 'school');
        break;
      case 'activities':
          this.openSubProfileModal(ActivityQuestionsComponent, 'activities');
          break;
      default:
        break;
    }
  }

  async openSubProfileModal(component: any, name: string) {
    const modal = await this.modalCtrl.create({
      component,
      backdropDismiss: false
    });
    modal.onWillDismiss().then((res) => {
      console.log('res.data', res.data);
      if (res.data && res.data.success) {
        console.log('name', name);
        switch (name) {
          case 'gae':
            this.completes.gae = true;
            break;
          case 'speak':
            this.completes.speak = true;
            break;
          //case 'learn':
          //  this.completes.learn = true;
          //  break;
          case 'religion':
            this.completes.religion = true;
            break;
          case 'relationship':
            this.completes.relationship = true;
            break;
          case 'career':
            this.completes.career = true;
            break;
          //case 'home':
          //  this.completes.home = true;
          //  break;
          //case 'hometown':
          //  this.completes.hometown = true;
          //  break;
          case 'hobbies':
            this.completes.hobbies = true;
            break;
          case 'causes':
            this.completes.causes = true;
            break;
          //case 'school':
          //  this.completes.school = true;
          //  break;
          case 'activities':
            this.completes.activities = true;
            break;
          default:
            break;
        }
        this.cdRef.detectChanges();
      }
    });
    return await modal.present();
  }

  onSubmit() {
    // this.navCtrl.navigateForward('/auth/final');
    this.navCtrl.navigateForward('/profile');
  }

  goBack() {
    this.navCtrl.navigateBack('/profile');
  }
}
