import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/_services/auth.service';
import { ApiService } from 'src/app/_services/api.service';
import { AdService } from 'src/app/_services/ad.service';
import { Ad, Company } from 'src/app/company/company.page';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage implements OnInit {

  user: any;
  users: any[];
  ad: Ad;
  sponsor: Company;
  
  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private adServ: AdService
  ) { }

  ngOnInit() {
    this.getLeaderboardData();
  }

  ionViewWillEnter() {
    this.adServ.getRandomAd().then((res: any) => {
      if (res && res.ad && res.sponsor) {
        this.ad = res.ad
        this.sponsor = res.sponsor
      }
      
    }).catch((err) => {
      console.log("Get Ad error: ", err)
    })
  }

  back() {
    this.navCtrl.navigateBack('/home');
  }

  getLeaderboardData() {
    this.api.get('alumni/leaderboard').subscribe((res: any) => {
      console.log('Got Leaderboard Data',res);
      this.user = res.user;
      res.users.sort((a, b) => {
        return a.rank - b.rank;
      });
      this.users = res.users;
    }, (err) => console.error('getLeaderboardData', err));
  }

  viewProfile(user) {
    this.navCtrl.navigateForward('/home/user/' + user.id);
  }

}
