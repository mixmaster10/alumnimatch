import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { ModalController } from '@ionic/angular';
import {
  RELATIONSHIPS,
  MARRIED_YEARS,
  GENDERS,
  KID_AGEGROUPS,
  ETHNICITIES,
  AGEGROUPS,
  BODY_TYPES,
  LAUGHING_COUNTS,
  MARRY_YEARS,
  FOODS,
  DRINKS,
  PETS,
  MUSICS
} from 'src/app/_config/current-life.constant';
import { ClRelationshipInviteModalComponent } from '../cl-relationship-invite-modal/cl-relationship-invite-modal.component';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-cl-relationship',
  templateUrl: './cl-relationship.component.html',
  styleUrls: ['./cl-relationship.component.scss'],
})
export class ClRelationshipComponent implements OnInit {

  selectRelationshipOption: any = {
    header: 'What is your current Relationship Status?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  relationships: string[] = RELATIONSHIPS;
  selectMarriedYearsOption: any = {
    header: 'How long have you been married?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  marriedyears = MARRIED_YEARS;

  selectGenderOption: any = {
    header: 'Choose gender',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  genders = GENDERS;

  selectAgeOption: any = {
    header: 'Choose age group',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  agegroups = KID_AGEGROUPS;

  selectFinanceOption: any = {
    header: 'Is your fiance from your college?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };

  selectSingleFoodOption: any = {
    header: 'Select foods',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  foods = FOODS;
  selectSingleEthnicityOption: any = {
    header: 'Select ethnicity',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  ethnicities = ETHNICITIES;
  selectSingleMusicOption: any = {
    header: 'Select type of music?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  musics = MUSICS;
  selectSingleDrinkOption: any = {
    header: 'How often do you drink socially?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  drinks = DRINKS;
  selectSingleSmokeOption: any = {
    header: 'Do you smoke or vape?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  selectSigleHavePetsOption: any = {
    header: 'Do you have pets?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  selectSiglePetsOption: any = {
    header: 'Which pet do you have?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  pets = PETS;
  selectLikePetsOption: any = {
    header: 'Do you like dogs or cats?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  selectPartnerAgeOption: any = {
    header: 'Choose your age group',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  partneragegroups = AGEGROUPS;
  selectBodyTypeOption: any = {
    header: 'Select body type:',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  bodytypes = BODY_TYPES;
  selectSingleLaughOption: any = {
    header: 'How often do you laugh?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  laughing_counts = LAUGHING_COUNTS;
  selectSigleMarriedOption: any = {
    header: 'Have you ever been married before?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  selectMarrigesOption: any = {
    header: 'How many other marriages have you had?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  selectKidsOption: any = {
    header: 'How many kids do you have?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  selectMarryYearsOption: any = {
    header: 'How long have you been married:',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  marry_years = MARRY_YEARS;

  data: any = {
    married: {},
    single: {},
    other: {},
    kids: [{}]
  };

  constructor(
    private api: ApiService,
    private utils: UtilsService,
    private modalCtrl: ModalController,
    private dataServ: DataService
  ) { }

  ngOnInit() {
    this.getUserRelationship();
  }

  getUserRelationship() {
    this.api.get('user/relationship', true).subscribe((res: any) => {
      console.log('user/relationship', res);
      this.data.relationship = res.relationship;
      this.data.married = res.married || {};
      
      this.data.single = res.single || {};

      this.data.other = res.other || {};
      this.data.widowed = res.widowed || {};
      if (res.kids && res.kids.length > 0) {
        setTimeout(() => {
          this.data.kids = res.kids;
        }, 50);
      }
    }, (err) => {
      console.error('user/relationship', err);
    });
  }

  onSubmit() {
    console.log('data', this.data);
    if (this.data.relationship === undefined) {
      this.utils.presentErrorAlert('Please select relationship');
      return;
    }
    let url = '', body: any = {};
    switch (this.data.relationship) {
      case 0:
        url = 'user/relationship/married';
        body = this.data.married;
        break;
      case 1:
        url = 'user/relationship/divorced';
        body = this.data.single;
        break;
      case 2:
        url = 'user/relationship/engaged';
        body = this.data.married;
        break;
      case 3:
        url = 'user/relationship/widowed';
        break;
      case 4:
        url = 'user/relationship/single';
        body = this.data.single;
        break;
      case 5:
        url = 'user/relationship/other';
        body = this.data.other;
        break;
      default:
        this.utils.presentErrorAlert('Please select relationship.');
        break;
    }
    if (url) {
      body.kids = this.data.kids;
      this.saveRelationship(url, body);
    }
  }

  saveRelationship(url, body) {
    this.api.post(url, body, true).subscribe((res) => {
      console.log('saveRelationship', res);
      this.modalCtrl.dismiss({success: true});
      this.dataServ.updateUserData({cl: {relationship: {relationship: this.data}}})

    }, (err) => {
      console.error('saveRelationship', err);
      alert("An error has occured. Your answers could not be saved. Please try again.")
    });
  }

  removeFood(foodIndex: number) {
    this.data.single.foods = this.data.single.foods.filter((food: number) => food !== foodIndex)
  }

  /* addFood() {
    if (!this.data.single.foods || !this.data.single.foods.length) {
      this.data.single.foods = [null];
    } else if (this.data.single.foods[this.data.single.foods.length - 1] !== null) {
      this.data.single.foods.push(null);
    }
  } */

  removeEthnicity(index: number) {
    this.data.single.ethnicity = this.data.single.ethnicity.filter((e: number) => e !== index)
  }

  /* addEthnicity() {
    if (!this.data.single.ethnicity || !this.data.single.ethnicity.length) {
      this.data.single.ethnicity = [null];
    } else if (this.data.single.ethnicity[this.data.single.ethnicity.length - 1] !== null) {
      this.data.single.ethnicity.push(null);
    }
  } */

  removeMusic(index: number) {
    this.data.single.music = this.data.single.music.filter((e: number) => e !== index)
  }

  /* addMusic() {
    if (!this.data.single.music || !this.data.single.music.length) {
      this.data.single.music = [null];
    } else if (this.data.single.music[this.data.single.music.length - 1] !== null) {
      this.data.single.music.push(null);
    }
  } */

  removeAgeGroup(ageIndex: number) {
    this.data.single.match_age = this.data.single.match_age.filter((age: number) => age !== ageIndex)
  }

  removeBodyType(typeIndex: number) {
    this.data.single.body_type = this.data.single.body_type.filter((type: number) => type !== typeIndex)
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  addKid() {
    if (this.data.kids && this.data.kids.length) {
      const lastItem = this.data.kids[this.data.kids.length - 1];
      if (lastItem.gender !== undefined && lastItem.age !== undefined ) {
        this.data.kids.push({});
      } else {
        return false;
      }
    } else {
      this.data.kids = [{}];
    }
  }

  getCurrentYear() {
    const date = new Date();
    return date.getFullYear();
  }

  async invitePartner() {
    const modal = await this.modalCtrl.create({
      component: ClRelationshipInviteModalComponent,
      backdropDismiss: false
    });
    return await modal.present();
  }

}
