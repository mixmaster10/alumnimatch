import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SelectAlumniModalComponent } from 'src/app/_shared/select-alumni-modal/select-alumni-modal.component';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-compose-message',
  templateUrl: './compose-message.component.html',
  styleUrls: ['./compose-message.component.scss'],
})
export class ComposeMessageComponent implements OnInit {

  messageTo = 'all';
  radius = 4;
  RADIUSDATA = [1, 2, 5, 10, 20];
  users: any[] = [];
  msgForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.msgForm = this.formBuilder.group({
      //title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      content: new FormControl('', [Validators.required, Validators.maxLength(144)])
    });
  }

  changeMessageTo($event) {
    if ($event.target.value === 'users') {
      // this.selectUsers();
    }
  }

  async selectUsers() {
    const modal = await this.modalCtrl.create({
      component: SelectAlumniModalComponent,
      componentProps: {
        selectedUser: this.users,
        multiple: true,
      },
      cssClass: 'select-modal-css',
      backdropDismiss: false
    });
    modal.onDidDismiss().then((res) => {
      console.log('selectUsers', res);
      if (res.data && res.data.length) {
        this.users = res.data;
      }
    }).catch((err) => {
      console.error('selectUsers', err);
    });
    return await modal.present();
  }

  onSubmit() {
    if (!this.msgForm.valid) {
      return false;
    }
    if (this.messageTo === 'users' && !this.users.length) {
      return false;
    }
    let url = '';
    const body = this.msgForm.value;
    switch (this.messageTo) {
      case 'all':
        url = 'message/send/all';
        break;
      case 'radius':
        url = 'message/send/radius';
        body.radius = this.RADIUSDATA[this.radius];
        break;
      case 'users':
        url = 'message/send/users';
        body.receiveIds = this.users.map(u => u.id);
        break;
      default:
        break;
    }
    this.api.post(url, body, true).subscribe((res) => {
      console.log('composeMessage', res);
      this.msgForm.reset();
    });
  }
}
