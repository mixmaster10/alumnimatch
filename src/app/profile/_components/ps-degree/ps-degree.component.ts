import { Component, OnInit } from '@angular/core';
import { SelectModalComponent } from 'src/app/_shared/select-modal/select-modal.component';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/_services/api.service';
import { DEGREES } from 'src/app/_config/degrees.constant';
import { IBCS } from 'src/app/_config/ibcs.constant';
import { UtilsService } from 'src/app/_services/utils.service';
import { DataSnapshot } from '@angular/fire/database/interfaces';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-ps-degree',
  templateUrl: './ps-degree.component.html',
  styleUrls: ['./ps-degree.component.scss'],
})
export class PsDegreeComponent implements OnInit {

  data: any[] = [{}];
  ACADEMICS = [1, 2, 3, 91, 94, 95, 105, 115, 116, 129, 130, 193, 194, 158, 159, 173, 195, 196, 277, 278, 302, 304, 305];

  selectDegreeTypeOption: any = {
    header: 'Select degree type',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  selectYearOption: any = {
    header: 'Select year graduated',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  ALLDEGREES: any[] = DEGREES;
  ALLIBCS: any[] = IBCS;

  YEARS: number[] = [];

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private utils: UtilsService,
    private dataServ: DataService
  ) { }

  ngOnInit() {
    this.YEARS = this.utils.generateYearList();
    this.getUserDegrees();
  }

  getUserDegrees() {
    this.api.get('user/degrees', true).subscribe((res: any[]) => {
      console.log('user degrees', res);
      if (res.length) {
        this.data = res;
      } else {
        this.data = [{}];
      }
    });
  }

  async selectDegree(item) {
    console.log('choose college', this.ALLDEGREES);
    const selectedItem = item.degree;
    const modal = await this.modalCtrl.create({
      component: SelectModalComponent,
      componentProps: {
        items: this.ALLDEGREES,
        selectedItem: selectedItem ? selectedItem.id : null,
        multiple: false,
        title: 'Select degree name'
      },
      cssClass: 'select-modal-css',
      backdropDismiss: false
    });
    modal.onDidDismiss().then((res) => {
      console.log('chooseCollege', res);
      if (res.data) {
        item.degree = res.data;
        if (this.ACADEMICS.includes(item.degree.id)) {
          item.ibc = {};
        } else {
          delete item.ibc;
        }
      }
    }).catch((err) => {
      console.error('chooseCollege', err);
    });
    return await modal.present();
  }

  async selectIBC(item) {
    const selectedItem = item.ibc;
    const modal = await this.modalCtrl.create({
      component: SelectModalComponent,
      componentProps: {
        items: this.ALLIBCS,
        selectedItem: selectedItem ? selectedItem.id : null,
        multiple: false,
        title: 'Select IBC'
      },
      cssClass: 'select-modal-css',
      backdropDismiss: false
    });
    modal.onDidDismiss().then((res) => {
      if (res.data) {
        item.ibc = res.data;
      }
    }).catch((err) => {
      console.error('chooseCollege', err);
    });
    return await modal.present();
  }

  addDegree() {
    if (this.data.length > 0
      && !this.data[this.data.length - 1].type
      && !this.data[this.data.length - 1].degree
      && !this.data[this.data.length - 1].year) {
        return;
    }
    this.data.push({});
  }

  onSubmit() {
    console.log('data', this.data);
    const filteredData = this.data.filter((item) => {
      if (item.hasOwnProperty('type') &&
        item.hasOwnProperty('degree') &&
        item.hasOwnProperty('year')
      ) {
        return true;
      } else {
        return false;
      }
    });
    console.log('filtered data', filteredData);
    if (!filteredData.length) {
      this.utils.presentErrorAlert('Please select degree.');
      return false;
    }
    this.api.post('user/degrees', {degrees: filteredData}, true).subscribe((res) => {
      console.log('saveDegrees', res);
      this.modalCtrl.dismiss({success: true});
      this.dataServ.updateUserData({ps: {degrees: filteredData}})
    }, (err) => {
      console.error('saveDegrees', err);
    });
  }


  dismiss() {
    this.modalCtrl.dismiss();
  }

  changeYear(item, $event) {
    const date = new Date($event.target.value);
    const year = date.getFullYear();
    item.year = year;
  }

}
