import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/_services/api.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-send-message-modal',
  templateUrl: './send-message-modal.component.html',
  styleUrls: ['./send-message-modal.component.scss'],
})
export class SendMessageModalComponent implements OnInit {

  msgForm: FormGroup;
  user: any;
  sub_conv: any;
  sub_msg: any;
  convId: any;
  messages: any = [];

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private navParams: NavParams,
    private api: ApiService,
    private utils: UtilsService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    const rid = this.navParams.get('rid');
    this.user = this.navParams.get('user');
    console.log('rid', rid);
    this.msgForm = this.formBuilder.group({
      //title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      content: new FormControl('', [Validators.required, Validators.maxLength(144)]),
      rid: new FormControl(rid, Validators.required)
    });
    
    this.sub_conv = this.messageService.getConversation(this.user.id).subscribe((conv: any) => {
      this.convId = null;
      this.messages = [];
      if (conv) {
        this.convId = conv.conversationId;
        if (this.sub_msg) this.sub_msg.unsubscribe();
        this.sub_msg = this.messageService.getMessage(this.convId).subscribe((conversations: any) => {
          this.messages = conversations.messages;
        })
      }
    })
  }

  ionViewWillLeave() {
    if (this.sub_conv) this.sub_conv.unsubscribe();
    if (this.sub_msg) this.sub_msg.unsubscribe();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  setMessagesRead() {
    let totalMessagesCount = this.messages.length;
    this.messageService.setMessagesRead(this.user, totalMessagesCount);
  }

  onSubmit() {
    let text = this.msgForm.value.content;
    this.messageService.sendMessage(text, 'text', this.messages, this.user, this.convId);
    setTimeout(() => {
      this.setMessagesRead()
    }, 500);
    this.modalCtrl.dismiss();
    // this.api.post('message/send', this.msgForm.value).subscribe((res) => {
    //   console.log('sendMessage', res);
    //   this.modalCtrl.dismiss(res);
    // }, (err) => {
    //   console.error('sendMessage', err);
    //   if (err.status === 403) {
    //     this.utils.presentErrorAlert(err.error.message);
    //   }
    //   this.modalCtrl.dismiss();
    // });
  }

}
