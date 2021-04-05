import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';
import { ModalController } from '@ionic/angular';
import { SATIS_LEVELS } from 'src/app/_config/current-life.constant';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-cl-school-questions',
  templateUrl: './cl-school-questions.component.html',
  styleUrls: ['./cl-school-questions.component.scss'],
})
export class ClSchoolQuestionsComponent implements OnInit {

  data: any = {};

  satis_levels = SATIS_LEVELS;
  selectSatisLevelOption: any = {
    header: 'Select level',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  constructor(
    private api: ApiService,
    private modalCtrl: ModalController,
    private dataServ: DataService
  ) { }

  ngOnInit() {
    this.getSchoolInfo();
  }

  getSchoolInfo() {
    this.api.get('user/school', true).subscribe((res: any[]) => {
      console.log('user/school', res);
      this.data = res;
    }, (err) => {
      console.error('user/school', err);
    });
  }

  onSubmit() {
    this.api.post('user/school', this.data, true).subscribe((res) => {
      console.log('user/school', res);
      this.modalCtrl.dismiss({success: true});
      this.dataServ.updateUserData({cl: {school: this.data}})

    }, (err) => {
      console.error('user/school', err);
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
