import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';
import { ModalController } from '@ionic/angular';
import { DetailMessageModalComponent } from '../detail-message-modal/detail-message-modal.component';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {

  @Input() msg: any;
  constructor(
    private api: ApiService,
    private dataSv: DataService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  markAsRead(mid) {
    if (this.msg.read) {
      return;
    }
    this.api.get(`message/read/${mid}`).subscribe((res) => {
      this.dataSv.markAsReadMessage(res, mid)
      this.msg.read = true;
    });
    
  }

  async viewMessage(msg) {
    const modal = await this.modalCtrl.create({
      component: DetailMessageModalComponent,
      backdropDismiss: false,
      componentProps: {msg, user: msg.sender},
    });
    modal.onWillDismiss().then(() => {
      msg.read = 1;
    });
    return await modal.present();
  }

}
