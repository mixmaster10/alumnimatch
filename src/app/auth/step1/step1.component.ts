import { Component } from '@angular/core';
import {  NavController } from '@ionic/angular';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component {
constructor( private nav: NavController) { }
  public getQuestions(questions) {
    console.log("Get Questions")
    this.nav.navigateForward(`auth/choose-college`, { state : {  questions } });
  }

}
