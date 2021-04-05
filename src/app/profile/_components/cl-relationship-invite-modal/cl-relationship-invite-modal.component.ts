import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-cl-relationship-invite-modal',
  templateUrl: './cl-relationship-invite-modal.component.html',
  styleUrls: ['./cl-relationship-invite-modal.component.scss'],
})
export class ClRelationshipInviteModalComponent implements OnInit {

  partnerForm: FormGroup;
  EMAIL_PATTERN = /^[a-zA-Z0-9_]+@[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_.]+$/;
  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.initPartnerForm();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  initPartnerForm() {
    this.partnerForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.pattern(this.EMAIL_PATTERN)]),
      phone: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    this.api.post('user/relationship/invite-partner', this.partnerForm.value).subscribe((res) => {
      console.log('user/relationship/invite-partner', res);
      this.dismiss();
    }, (err) => {
      console.error('user/relationship/invite-partner', err);
    });
  }
}
