import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavController, ModalController, IonTextarea, ActionSheetController, Platform } from '@ionic/angular';
import { ApiService } from 'src/app/_services/api.service';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/_services/data.service';
import { SendMessageModalComponent } from 'src/app/_shared/send-message-modal/send-message-modal.component';
import { DetailMessageModalComponent } from 'src/app/_shared/detail-message-modal/detail-message-modal.component';
import { Subscription } from 'rxjs/internal/Subscription';
import { MessageService } from 'src/app/_services/message.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImageViewComponent } from 'src/app/home/messages/image-view/image-view.component';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, OnDestroy {
  @ViewChild('content', {static: true}) content: any;
  @ViewChild('inpText', {static: false}) inpText: IonTextarea;
  uid: any;
  me_uid: any;
  user: any;
  curUser: any;
  convId; any;
  messages_show: any = [];
  messages: any = [];
  subscriptions: Subscription[] = [];
  text = '';
  loading = true;

  sub_conv: any;
  sub_msg: any;
  startIdx = -1;

  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private dataSv: DataService,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private messageService: MessageService,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private platform: Platform
  ) {
    this.route.queryParams.subscribe(params => {
      this.uid = params.id;
    })
  }

  ngOnInit() {
    this.curUser = this.messageService.getCurrentUser();
    this.me_uid = this.curUser.id;
    this.api.get(`alumni/detail/${this.uid}`).subscribe((res: any) => {
      this.user = res.alumni;
      this.loadMessages();
    });
  }

  ionViewWillLeave() {
    if (this.sub_conv) this.sub_conv.unsubscribe();
    if (this.sub_msg) this.sub_msg.unsubscribe();
  }

  loadMessages() {
    if (this.sub_conv) this.sub_conv.unsubscribe();
    this.sub_conv = this.messageService.getConversation(this.user.id).subscribe((conv: any) => {
      if (conv) {
        this.convId = conv.conversationId;
        if (this.sub_msg) this.sub_msg.unsubscribe();
        this.sub_msg = this.messageService.getMessage(this.convId).subscribe((conversations: any) => {
          this.messages = conversations.messages;
          this.messages.forEach((msg, index) => {
            msg.message = this.messageService.urlDetectReplace(msg.message)
          })

          if (this.startIdx == -1) {
            this.startIdx = this.messages.length > 10 ? this.messages.length - 10 : 0;
          }
          this.messages_show = [];
          for (let i=this.startIdx; i<this.messages.length; i++) {
            this.messages[i]['idx'] = i;
            this.messages_show.push(this.messages[i])
          }

          this.setMessagesRead();
        })
      }
      this.loading = false;
    })
    this.inpText.setFocus();
  }

  loadMore() {
    if (this.startIdx) {
      this.startIdx -= 10;
      if(this.startIdx < 0) this.startIdx = 0;
      for (let i=this.startIdx + 10-1; i>=this.startIdx; i--) {
        this.messages_show.unshift(this.messages[i])
      }
    }
  }

  setMessagesRead() {
    let totalMessagesCount = this.messages.length;
    this.messageService.setMessagesRead(this.user, totalMessagesCount);

    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 500)
  }

  sendCheck(ev) {
    if (!this.platform.is('cordova')) {
      if (ev.ctrlKey) {
        this.send();
      }
    }
  }

  send() {
    this.messageService.sendMessage(this.text, 'text', this.messages, this.user, this.convId);
    this.text = '';
    this.inpText.setFocus();
  }

  async openImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Image.',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Take a photo',
        icon: 'camera',
        handler: () => {
          this.addImage(this.camera.PictureSourceType.CAMERA);
        }
      }, {
        text: 'Photo library',
        icon: 'image',
        handler: () => {
          this.addImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  addImage(option) {
    if (this.platform.is('cordova')) { // mobile
      const options: CameraOptions = {
        quality: 50,
        sourceType: option,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        allowEdit: true,
        targetWidth: 1000,
        targetHeight: 1000
      }
      
      this.camera.getPicture(options).then((data) => {
        let base64Image = 'data:image/jpeg;base64,' + data;
        this.sendImage(base64Image);
      }, (err) => {
        console.log(err);
      });
    } else { // web

    }
  }

  sendImage(image) {
    this.messageService.sendMessage('', 'image', this.messages, this.user, this.convId);
  }

  async showImage(image) {
    const modal = await this.modalCtrl.create({
      component: ImageViewComponent,
      componentProps: {
        image: image
      }
    });
    return await modal.present();
  }

  ngOnDestroy() {
  }

  back() {
    // this.navCtrl.navigateBack('/home/messages');
    this.navCtrl.back();
  }

}
