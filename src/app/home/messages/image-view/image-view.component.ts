import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss'],
})
export class ImageViewComponent implements OnInit {
  image = 'https://www.ajactraining.org/wp-content/uploads/2019/09/image-placeholder.jpg';
  constructor(
    private modalCtrl: ModalController,
    public navParams: NavParams
  ) { 
    this.image = navParams.get('image');
  }

  ngOnInit() {}

  back() {
    this.modalCtrl.dismiss();
  }

}
