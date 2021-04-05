import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-names',
  templateUrl: './names.component.html',
  styleUrls: ['./names.component.scss'],
})
export class NamesComponent implements OnInit {

  nameForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    const user = this.navParams.get('user');
    console.log('user', user);
    this.nameForm = this.formBuilder.group({
      first_name: new FormControl(user.first_name, [Validators.required, Validators.maxLength(50)]),
      last_name: new FormControl(user.last_name, [Validators.required, Validators.maxLength(50)])
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onSubmit() {
    if (this.nameForm.valid) {
      this.modalCtrl.dismiss(this.nameForm.value);
    }
  }
}
