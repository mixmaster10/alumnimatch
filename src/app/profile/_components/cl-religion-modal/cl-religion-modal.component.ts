import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RELIGION_YEARS, RELIGIONS, RELIGION_IMPORTANCES } from 'src/app/_config/current-life.constant';
import { ApiService } from 'src/app/_services/api.service';
import { DataService } from 'src/app/_services/data.service';
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: 'app-cl-religion-modal',
  templateUrl: './cl-religion-modal.component.html',
  styleUrls: ['./cl-religion-modal.component.scss'],
})
export class ClReligionModalComponent implements OnInit {

  years = RELIGION_YEARS;
  religions = RELIGIONS;
  importances = RELIGION_IMPORTANCES;

  selectReligionOption: any = {
    header: 'What is your Religion?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  selectReligionYearsOption: any = {
    header: 'How many years have you been this religion?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  selectImportantOption: any = {
    header: 'How important is your religion for matching you to?',
    mode: 'md',
    cssClass: 'am-select-popup'
  };

  data: any = {};

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private utils: UtilsService,
    private dataServ: DataService
  ) { }

  ngOnInit() {
    this.getUserReligion();
  }

  getUserReligion() {
    this.api.get('user/religion', true).subscribe((res) => {
      console.log('user/religion', res);
      if (res) {
        this.data = res;
      }
    }, (err) => {
      console.error('user/religion', err);
    });
  }

  onSubmit() {
    if (this.data.religion === undefined) {
      this.utils.presentErrorAlert('Please select religion status.');
      return;
    }
    this.api.post('user/religion', this.data, true).subscribe((res) => {
      console.log('onSubmit', res);
      this.modalCtrl.dismiss({success: true});
      this.dataServ.updateUserData({cl: {religion: this.data}})
    }, (err) => {
      console.error('onSubmit', err);
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
