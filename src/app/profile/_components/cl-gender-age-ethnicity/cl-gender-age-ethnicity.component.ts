import { Component, OnInit } from '@angular/core';
import { GENDERS, AGEGROUPS, ETHNICITIES } from 'src/app/_config/current-life.constant';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/_services/api.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-cl-gender-age-ethnicity',
  templateUrl: './cl-gender-age-ethnicity.component.html',
  styleUrls: ['./cl-gender-age-ethnicity.component.scss'],
})
export class ClGenderAgeEthnicityComponent implements OnInit {
  gender: any;
  age: any;
  ethnicity: any = {};

  genders = GENDERS;
  agegroups = AGEGROUPS;
  ethnicities = ETHNICITIES;

  selectGenderOption: any = {
    header: 'Choose your gender',
    mode: 'md',
    cssClass: 'am-select-popup'
  };

  selectAgeOption: any = {
    header: 'Choose your age group',
    mode: 'md',
    cssClass: 'am-select-popup'
  };

  selectEthnicityOption: any = {
    header: 'What is your Ethnicity?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private utils: UtilsService,
    private dataServ: DataService
  ) { }

  ngOnInit() {
    this.getGAE();
  }

  getGAE() {
    this.api.get('user/gae', true).subscribe((res: any) => {
      if (res.gender_age) {
        this.gender = res.gender_age.gender;
        this.age = res.gender_age.age;
      }
      if (res.ethnicity) {
        this.ethnicity = res.ethnicity;
      }
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onSubmit() {
    if (this.gender === undefined) {
      this.utils.presentErrorAlert('Please select gender.');
      return;
    }
    if (this.age === undefined) {
      this.utils.presentErrorAlert('Please select aga group.');
      return;
    }
    if (this.ethnicity.ethnicity === undefined) {
      this.utils.presentErrorAlert('Please select ethnicity.');
      return;
    }
    const data = {
      gender: this.gender,
      age: this.age,
      ethnicity: this.ethnicity
    };
    console.log('data', data);
    this.api.post('user/gae', data, true).subscribe((res) => {
      console.log('saveUserGenderAgeEthnicity', res);
      this.modalCtrl.dismiss({success: true});
      this.dataServ.updateUserData({cl: {gender_age: data}})
    }, (err) => {
      console.error('saveUserGenderAgeEthnicity', err);
    });
  }

}
