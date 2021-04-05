import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { DataService } from 'src/app/_services/data.service';
import { DetailMessageModalComponent } from 'src/app/_shared/detail-message-modal/detail-message-modal.component';
import { Subscription } from 'rxjs/internal/Subscription';
import { MessageService } from 'src/app/_services/message.service';
import { AdService } from 'src/app/_services/ad.service';
import { Ad, Company } from 'src/app/company/company.page';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit, OnDestroy {

  user: any;
  messages: any = [];
  subscriptions: Subscription[] = [];
  ad: Ad;
  sponsor: Company;

  constructor(
    private api: ApiService,
    private dataSv: DataService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private messageService: MessageService,
    private router: Router,
    private adServ: AdService
  ) { }

  ngOnInit() {
    this.messageService.getMessages().subscribe((conv: any) => {
      if (conv) {
        for (let c in conv) {
          let convId = conv[c].conversationId;
          this.messageService.getMessage(convId).subscribe((msg: any) => {
            if (msg && msg.messages) {
              conv[c].unreadMessagesCount = msg.messages.length - conv[c].messagesRead;
              this.addUpdateMessages(conv[c], msg.messages[msg.messages.length -1]);
            }
          })
        }
      }
    })
  }

  ionViewWillEnter() {
    this.adServ.getRandomAd().then((res: any) => {
      console.log("Random ad", res)
      if (res && res.ad && res.sponsor) {
        this.ad = res.ad
        this.sponsor = res.sponsor
      }
      
    }, (err) => {
      console.log("Get Ad error: ", err)
    })
  }

  addUpdateMessages(conv, msg) {
    let i = -1;
    this.messages.forEach((m, idx) => {
      if (m.user.id == conv.user.id) {
        i = idx;
      }
    })

    conv.msg = msg;
    if (i > -1) {
      this.messages[i] = conv
    } else {
      this.messages.push(conv)
    }

    this.messages.sort((a: any, b: any) => {
      let date1 = new Date(a.msg.date);
      let date2 = new Date(b.msg.date);
      if (date1 > date2) {
        return -1;
      } else if (date1 < date2) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  goMessage(conv) {
    this.router.navigate(['/home/messages/user'], {
      queryParams: {
        id: conv.user.id
      }
    });
  }

  ngOnDestroy() {
  }

  back() {
    this.navCtrl.back();
  }
  toFriends() {
    this.router.navigate(['/home/friends']);
  }

  /*
  ngOnInit() {
    this.getMessages();
    this.subscriptions.push(this.dataSv.msgRead.subscribe((res) => {
      this.messages.forEach((msg) => {
        if (msg.id === res) {
          msg.read = true;
        }
      });
    }));
    this.subscriptions.push(this.dataSv.userStatus.subscribe((res) => {
      this.user.unread_num = res.messages_count || 0;
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((el) => {
      el.unsubscribe();
    });
  }

  back() {
    this.navCtrl.navigateBack('/home');
  }

  getMessages() {
    this.api.get('message/users').subscribe((res: any) => {
      this.user = res.user;
      this.messages = res.messages;
      this.dataSv.updateMessageNum(res.user.unread_num);
    }, (err) => console.error('getMessages', err));
  }

  viewMessages($event) {
    console.log('viewMessages', $event);
    this.dataSv.alumni = $event;
    this.navCtrl.navigateForward(`home/messages/user/${$event.id}`);
  }

  async viewMessage(msg) {
    const modal = await this.modalCtrl.create({
      component: DetailMessageModalComponent,
      backdropDismiss: false,
      componentProps: {msg, user: msg.sender || msg.receiver},
    });
    modal.onWillDismiss().then(() => {
      msg.read = 1;
    });
    return await modal.present();
  }

  markAsRead(msg) {
    if (msg.read) {
      return;
    }
    this.dataSv.markAsReadMessage(msg.id).then(() => {
      msg.read = true;
    });
  }

  composeMsg() {
    this.navCtrl.navigateForward('/home/messages/compose');
  }
  */
}
