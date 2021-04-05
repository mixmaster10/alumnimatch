import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-select-alumni-modal',
  templateUrl: './select-alumni-modal.component.html',
  styleUrls: ['./select-alumni-modal.component.scss'],
})
export class SelectAlumniModalComponent implements OnInit {

  multiple: boolean;
  selectedUser: any | any[];
  users: any[];

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private navParams: NavParams
  ) {
    this.multiple = navParams.get('multiple');
    this.selectedUser = navParams.get('selectedUser');
  }

  ngOnInit() {
    this.getUsers();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  getUsers() {
    this.api.get('friend/all').subscribe((res: any[]) => {
      this.users = res;
      if (this.selectedUser && this.selectedUser.length > 0) {
        const selectedIds = this.selectedUser.map(v => v.id);
        this.users.forEach((item) => {
          const index = selectedIds.indexOf(item.id);
          item.selected = (index > -1);
        });
      }
    });
  }

  onSelect() {
    if (this.multiple) {
      const res = this.users.filter(x => x.selected === true);
      this.modalCtrl.dismiss(res);
    } else {
      const res = this.users.find(x => x.id === this.selectedUser);
      this.modalCtrl.dismiss(res);
    }
  }

}
