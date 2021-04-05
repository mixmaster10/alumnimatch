import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-view-sponsors',
  templateUrl: './view-sponsors.page.html',
  styleUrls: ['./view-sponsors.page.scss'],
})
export class ViewSponsorsPage implements OnInit {

  sponsors: any[] = [{name: 'Germinate', id: 'germinate'}];
  requests: any[] = [];
  suggests: any[] = [];
  interacteds: any[] = [];

  sponsorSegment = 'all';


  constructor(
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
  }

  segmentChanged($event) {
    console.log(`Segment Changed: ${$event}`)
  }

  getAllSponsors() {
    console.log(`Getting all sponsors`)
  }

  getInteracteds() {
    console.log('Getting Sponsors interacted with')
  }

  viewSponsor(sponsor) {
    this.navCtrl.navigateForward('view-sponsors/sponsor/' + sponsor.id);
  }

  back() {
    this.navCtrl.navigateBack('/home');
  }

}
