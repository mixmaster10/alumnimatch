import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-interested-input',
  templateUrl: './interested-input.component.html',
  styleUrls: ['./interested-input.component.scss'],
})
export class InterestedInputComponent implements OnInit {

  email: string = ''
  additionalInfo: string = ''
  constructor(
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {}

  onSubmit() {
    this.popoverCtrl.dismiss({email: this.email, additionalInfo: this.additionalInfo, cancelled: false})
  }

  onCancel() {
    this.popoverCtrl.dismiss()
  }

}
