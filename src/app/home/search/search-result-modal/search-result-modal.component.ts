import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';
import { ModalController, NavController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-search-result-modal',
  templateUrl: './search-result-modal.component.html',
  styleUrls: ['./search-result-modal.component.scss'],
})
export class SearchResultModalComponent implements OnInit {

  users: any[] = [];
  is_load = 0;
  constructor(
    private api: ApiService,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.getSearchResult();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  getSearchResult() {
    this.is_load = 1;
    const body = this.navParams.get('body');
    this.api.post('alumni/search?count=' + this.users.length, body).subscribe((res: any[]) => {
      this.users = this.users.concat(res);
      if (res.length < 20) {
        this.is_load = 2;
      } else {
        this.is_load = 0;
      }
    });
  }

  viewProfile(user) {
    this.navCtrl.navigateForward('/home/user/' + user.id);
    this.dismiss()
  }
}
