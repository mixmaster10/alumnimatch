import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/_services/api.service';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-detail-message-modal',
  templateUrl: './detail-message-modal.component.html',
  styleUrls: ['./detail-message-modal.component.scss'],
})
export class DetailMessageModalComponent implements OnInit {

  msg: any;
  user: any;
  constructor(
    private api: ApiService,
    private dataSv: DataService,
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) {
    this.msg = this.navParams.get('msg');
    this.user = this.navParams.get('user');
  }

  ngOnInit() {
    this.markAsRead(this.msg);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  markAsRead(msg) {
    if (msg.read) {
      return;
    }
    this.api.get(`message/read/${msg.id}`).subscribe((res) => {
      this.dataSv.markAsReadMessage(res, msg.id)
      this.msg.read = true;
    });
  }

  async reply() {
    this.modalCtrl.dismiss('replied');
  }

  deleteMsg() {
    this.api.delete(`message/${this.msg.id}`).subscribe((res) => {
      this.modalCtrl.dismiss('deleted');
    });
  }

}
