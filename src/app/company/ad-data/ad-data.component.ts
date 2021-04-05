import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/_services/api.service';
import { Ad, Company } from '../company.page';

@Component({
  selector: 'app-ad-data',
  templateUrl: './ad-data.component.html',
  styleUrls: ['./ad-data.component.scss'],
})
export class AdDataComponent implements OnInit {

  ad: Ad;
  company: Company;
  segment = 'interest';

  interestedUsers = new Array()
  commentedUsers = new Array()
  viewedProfileUsers = new Array()

  constructor(
    private navCtrl: NavController,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.ad = history.state.ad
    this.company = history.state.sponsor

    if (this.ad.leadsUsed) {
      if (this.ad.leadsUsed.likes && this.ad.leadsUsed.likes.length > 0) {
        this.ad.leadsUsed.likes.forEach((user) => {

          this.addInterestedUser(user.user_id)
        })
      }

      if (this.ad.leadsUsed.comments && this.ad.leadsUsed.comments.length > 0) {
        this.ad.leadsUsed.comments.forEach((comment) => {

          this.addCommentedUser(comment.user.id)
        })
      }

      if (this.ad.leadsUsed.viewed_sponsor && this.ad.leadsUsed.viewed_sponsor.length > 0) {
        this.ad.leadsUsed.viewed_sponsor.forEach((user) => {
          this.addViewedProfileUser(user.user_id)
        })
      }
    }

  }

  changeSegment($event) {
    this.segment = $event.target.value;
    console.log(this.segment)
  }

  addInterestedUser(uid) {
    this.api.get(`alumni/detail/${uid}`).subscribe((res: any) => {
      console.log('getUserProfile', res);
      if (res.alumni) {
        const userNote = this.ad.leadsUsed.likes.find(like => like.user_id === uid )
        this.interestedUsers.push({...res.alumni, interest: userNote})
      }
      console.log(this.interestedUsers)
    });
  }

  addCommentedUser(uid) {
      this.api.get(`alumni/detail/${uid}`).subscribe((res: any) => {
        console.log('getUserProfile', res);
        console.log(this.commentedUsers.findIndex((user) => user.id === uid))
        if (res.alumni && (this.commentedUsers.length === 0 || this.commentedUsers.findIndex((user) => user.id === uid) === -1)) {
          const userComments = this.ad.leadsUsed.comments.map(comment => comment.user.id === uid ? comment.comment : null )
          this.commentedUsers.push({...res.alumni, comments: userComments})
        }
        console.log(this.commentedUsers)
      });
    
    
  }

  addViewedProfileUser(uid) {
    this.api.get(`alumni/detail/${uid}`).subscribe((res: any) => {
      console.log('getUserProfile', res);
      if (res.alumni) {
        this.viewedProfileUsers.push(res.alumni)
      }
      console.log(this.viewedProfileUsers)
    });
  }

  viewProfile(user) {
    this.navCtrl.navigateForward('/home/user/' + user.id);
  }

  back() {
    this.navCtrl.navigateBack('/company');
  }

}
