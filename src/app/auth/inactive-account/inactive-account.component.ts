import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/_services/utils.service';
import { ApiService } from 'src/app/_services/api.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-inactive-account',
  templateUrl: './inactive-account.component.html',
  styleUrls: ['./inactive-account.component.scss'],
})
export class InactiveAccountComponent implements OnInit {

  ticketForm: FormGroup;
  EMAIL_PATTERN = /^[a-zA-Z0-9_]+@[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_.]+$/;
  constructor(
    private formBuilder: FormBuilder,
    private utils: UtilsService,
    private api: ApiService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.initTicketForm();
  }

  initTicketForm() {
    this.ticketForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.pattern(this.EMAIL_PATTERN)]),
      message: new FormControl('', [Validators.required, Validators.minLength(10)])
    });
  }

  onSubmit() {
    if (!this.ticketForm.valid) {
      let error = '';
      if (this.ticketForm.controls.email.errors) {
        if (this.ticketForm.controls.email.errors.required) {
          error = 'Email is required.';
        } else if (this.ticketForm.controls.email.errors.pattern) {
          error = 'Invalid email address.';
        }
      } else {
        error = 'Please enter your ticket message (more than 10 characters).';
      }
      this.utils.presentWarningAlert(error);
      return;
    }
    console.log('ticket', this.ticketForm.value);
    this.api.post('auth/ticket/account', this.ticketForm.value).subscribe((res) => {
      this.utils.presentAlert(null, res);
      this.ticketForm.reset();
    }, (err) => {
      console.error('error', err);
    });
  }

  goBack() {
    this.auth.signout();
  }

}
