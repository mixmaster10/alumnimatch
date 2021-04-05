import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlumniModalComponent } from '../alumni-modal/alumni-modal.component';

@Component({
  selector: 'app-alumni-sm',
  templateUrl: './alumni-sm.component.html',
  styleUrls: ['./alumni-sm.component.scss'],
})
export class AlumniSmComponent implements OnInit {

  @Input() user: any;
  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    console.log("User", this.user)
  }

  async viewProfile() {
    const modal = await this.modalCtrl.create({
      component: AlumniModalComponent,
      componentProps: {user: this.user},
      cssClass: 'alumni-modal-css'
    });
    return await modal.present();
  }

}
