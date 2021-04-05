import { Component, OnInit } from '@angular/core';
import { LANGUAGES } from 'src/app/_config/current-life.constant';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/_services/api.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-cl-learn-language',
  templateUrl: './cl-learn-language.component.html',
  styleUrls: ['./cl-learn-language.component.scss'],
})
export class ClLearnLanguageComponent implements OnInit {

  selectLearnLanguageOption: any = {
    header: 'What languages are you trying to learn?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };

  languages = LANGUAGES;
  data: any = {
    languages: [{}],
    ranges: {}
  };
  modelLanguages: string[];

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private utils: UtilsService,
    private dataServ: DataService
  ) { }

  ngOnInit() {
    this.getLearnLanguages();
  }

  getLearnLanguages() {
    this.api.get('user/languages/learn', true).subscribe((res: any) => {
      console.log('getLearnLanguages', JSON.stringify(res));
      if (res.languages && res.languages.length) {
        this.data.languages = res.languages;
        this.modelLanguages = this.data.languages.map(language => language.language)
      }
      if (res.ranges) {
        this.data.ranges = res.ranges;
      }
    });
  }

  setLanguages(event) {
    console.log('Event: ', JSON.stringify(event))
    this.modelLanguages = event

    for (const eve of event) {
      if (!this.data.languages.find(language => language.language === eve)) {
        this.data.languages.push({language: eve});
      }
    }

    this.data.languages = this.data.languages.filter(pieceOfData => event.find(language => language === pieceOfData.language) != null)

    console.log(this.modelLanguages, JSON.stringify(this.data.languages))
  }

  removeLanguage(languageIndex: number) {
    console.log('Languages: ', JSON.stringify(this.data.languages), ' - LanguageIndex to remove: ', JSON.stringify(languageIndex))
    this.data.languages = this.data.languages.filter((lang) => lang.language !== languageIndex)
    this.modelLanguages = this.data.languages.map(language => language.language)
  }

  addLanguage() {
    console.log('data', JSON.stringify(this.data));

    if (this.data.languages.length === 0) {
      this.data.languages.push({});
    }
  }

  /* changeSelction($event) {
    console.log('event', $event);
  } */

  onSubmit() {
    const filteredLanguages = this.data.languages.filter(x => {
      return x.language !== undefined;
    });
    this.api.post('user/languages/learn', {
      languages: filteredLanguages,
      ranges: this.data.ranges
    }, true).subscribe((res) => {
      console.log('saveLearnLanguages', res);
      this.modalCtrl.dismiss({success: true});
      this.dataServ.updateUserData({cl: {learn_languages: this.data}})
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
