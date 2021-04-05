import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/_services/api.service';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/_services/data.service';
import { SendMessageModalComponent } from 'src/app/_shared/send-message-modal/send-message-modal.component';
import { DetailMessageModalComponent } from 'src/app/_shared/detail-message-modal/detail-message-modal.component';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-user-messages',
  templateUrl: './user-messages.component.html',
  styleUrls: ['./user-messages.component.scss'],
})
export class UserMessagesComponent implements OnInit, OnDestroy {

  uid: any;
  user: any;
  alumni: any;
  messages: any[];
  subscriptions: Subscription[] = [];

  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private dataSv: DataService,
    private route: ActivatedRoute,
    private modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.user);
    this.alumni = this.dataSv.alumni;
    if (!this.alumni) {
      this.back();
    } else {
      this.uid = this.route.snapshot.paramMap.get('id');
      this.getUserMessages(this.uid);
    }
    this.subscriptions.push(this.dataSv.msgRead.subscribe((res) => {
      this.messages.forEach((msg) => {
        if (msg.id === res) {
          msg.read = true;
        }
      });
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => {
      el.unsubscribe();
    });
  }

  back() {
    this.dataSv.alumni = null;
    this.navCtrl.navigateBack('/home/messages');
  }

  getUserMessages(uid) {
    this.api.get(`message/user/${uid}${this.messages ? ('?count=' + this.messages.length) : ''}`, true).subscribe((res: any) => {
      this.messages = res.messages;
    });
  }

  async sendMessage() {
    const modal = await this.modalCtrl.create({
      component: SendMessageModalComponent,
      componentProps: {rid: this.uid},
      cssClass: 'send-message-modal-css'
    });
    modal.onWillDismiss().then((result) => {
      console.log('result', result);
      if (result && result.data) {
        this.messages.unshift(result.data);
      }
    });
    return await modal.present();
  }

  markAsRead(msg) {
    if (msg.read) {
      return;
    }
    this.api.get(`message/read/${msg.id}`).subscribe((res) => {
      this.dataSv.markAsReadMessage(res, msg.id)
      msg.read = true;
    });
  }

  async viewMessage(msg) {
    const modal = await this.modalCtrl.create({
      component: DetailMessageModalComponent,
      backdropDismiss: false,
      componentProps: {msg, user: this.alumni},
    });
    modal.onWillDismiss().then((result) => {
      if (result && result.data) {
        console.log('result.data', result.data);
        if (result.data === 'deleted') {
          const index = this.messages.map(m => m.id).indexOf(msg.id);
          this.messages.splice(index, 1);
        } else if (result.data === 'replied') {
          this.sendMessage();
        }
      }
      msg.read = 1;
    });
    return await modal.present();
  }
}
