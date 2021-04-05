import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LANGUAGES } from 'src/app/_config/current-life.constant';
import { ApiService } from 'src/app/_services/api.service';
import { DataService } from 'src/app/_services/data.service';
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: 'app-cl-speak-languages',
  templateUrl: './cl-speak-languages.component.html',
  styleUrls: ['./cl-speak-languages.component.scss'],
})
export class ClSpeakLanguagesComponent implements OnInit {

  selectLanguageOption: any = {
    header: 'What languages do you speak fluently?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  languages = LANGUAGES;

  data: number[] = [null];

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private utils: UtilsService,
    private dataServ: DataService
  ) { }

  ngOnInit() {
    this.getSpeakLanguages();
  }

  getSpeakLanguages() {
    this.api.get('user/languages/speak', true).subscribe((res: []) => {
      console.log('getSpeakLanguages');
      if (res.length) {
        this.data = res;
      } else {
        this.data = [null];
      }
    });
  }

  removeLanguage(languageIndex: number) {
    this.data = this.data.filter((lang: number) => lang !== languageIndex)
  }

  addLanguage() {
    console.log('data', this.data);
    if (this.data[this.data.length - 1] !== null) {
      this.data.push(-1);
    }
  }

  changeSelction($event) {
    console.log('event', $event);
  }

  onSubmit() {
    const filteredData = this.data.filter(x => {
      return x !== null;
    });
    if (!filteredData.length) {
      this.utils.presentErrorAlert('Please select language you speak.');
      return;
    }
    this.api.post('user/languages/speak', filteredData, true).subscribe((res) => {
      console.log('saveSpeakLanguages', res);
      this.modalCtrl.dismiss({success: true});
      this.dataServ.updateUserData({cl: {speak_languages: filteredData}})
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
