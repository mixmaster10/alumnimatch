import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-login-messages',
  templateUrl: './login-messages.component.html',
  styleUrls: ['./login-messages.component.scss'],
})
export class LoginMessagesComponent implements OnInit {
  @Input() header: string;
  @Input() body: string;

  constructor(
    private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {}

  close() {
    this.popoverCtrl.dismiss()
  }
}
