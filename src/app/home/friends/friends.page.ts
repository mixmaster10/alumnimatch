import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/_services/api.service';
import { ActivatedRoute } from '@angular/router';
import { PushService } from 'src/app/_services/push.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { DataService } from 'src/app/_services/data.service';
import { AdService } from 'src/app/_services/ad.service';
import { Ad, Company } from 'src/app/company/company.page';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  fsegment = 'all';

  users: any[] = [];
  requests: any[] = [];
  suggests: any[] = [];
  visits: any[] = [];
  friends: any[] = [];
  pendings: any[] = [];
  blocks: any[] = []

  load: any = {};
  subscriptions: Subscription[] = [];

  ad: Ad;
  sponsor: Company;

  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private route: ActivatedRoute,
    private push: PushService,
    private dataSv: DataService,
    private adServ: AdService
  ) {
    console.log(location.href);
    const segment = this.route.snapshot.paramMap.get('segment');
    console.log('this.fsegment', segment);
    if (segment) {
      this.fsegment = segment;
    } else {
      this.fsegment = 'all';
    }
    this.getBlocks()
  }

  ngOnInit() {
    this.initLoadData(this.fsegment);
    this.subscriptions.push(this.push.freqAccepted.subscribe((res) => {
      const freqIndex = this.requests.map(x => x.id).indexOf(res.id);
      if (freqIndex > -1) {
        this.requests.splice(freqIndex, 1);
      }
      this.friends = [...this.friends, res];
    }));
    this.subscriptions.push(this.push.freqReceived.subscribe((res) => {
      this.requests = [...this.requests, res];
    }));
  }

  ionViewWillEnter() {
    this.adServ.getRandomAd().then((res: any) => {
      console.log("Random ad", res)
      if (res && res.ad && res.sponsor) {
        this.ad = res.ad
        this.sponsor = res.sponsor
      }
      
    }, (err) => {
      console.log("Get Ad error: ", err)
    })
  }

  back() {
    this.navCtrl.navigateBack('/home');
  }

  segmentChanged($event) {
    this.initLoadData($event.target.value);
  }

  initLoadData(seg) {
    switch (seg) {
      case 'all':
        if (!this.users.length) {
          this.getAllUsers();
        }
        break;
      case 'requests':
        if (!this.requests.length) {
          this.getFriendRequests();
        }
        break;
      case 'suggests':
        if (!this.suggests.length) {
          this.getSuggests();
        }
        break;
      case 'visits':
        if (!this.visits.length) {
          this.getVisits();
        }
        break;
      case 'friends':
        if (!this.friends.length) {
          this.getFriends();
        }
        break;
      case 'pendings':
        if (!this.pendings.length) {
          this.getPendings();
        }
        break;
      case 'blocks':
        if (!this.blocks.length) {
          this.getBlocks();
        }
        break;
    }
  }

  getAllUsers() {
    this.load.users = 1;
    console.log(this.users.length);
    this.api.get(`alumni/users?count=${this.users.length}`).subscribe((res: any[]) => {
      console.log("Res: ", res, "Blocks: ", this.blocks)
      this.users = this.users.concat(res).filter((user) => !this.blocks.find((block) => user.id === block.id));
      if (res.length < 20) {
        this.load.users = 2;
      } else {
        this.load.users = 0;
      }
    });
  }

  getFriendRequests() {
    this.load.requests = 1;
    this.api.get(`alumni/requests?count=${this.requests.length}`).subscribe((res: any[]) => {
      this.requests = this.requests.concat(res);
      if (res.length < 20) {
        this.load.requests = 2;
      } else {
        this.load.requests = 0;
      }
      this.dataSv.updateFriendRequest(this.requests);
    });
  }

  getSuggests() {
    this.load.suggests = 1;
    this.api.get(`alumni/suggests?count=${this.suggests.length}`).subscribe((res: any[]) => {
      this.suggests = this.suggests.concat(res).filter((user) => !this.blocks.find((block) => user.id === block.id));
      if (res.length < 20) {
        this.load.suggests = 2;
      } else {
        this.load.suggests = 0;
      }
    });
  }

  getVisits() {
    this.load.visits = 1;
    this.api.get(`alumni/visits?count=${this.visits.length}`).subscribe((res: any[]) => {
      this.visits = this.visits.concat(res);
      if (res.length < 20) {
        this.load.visits = 2;
      } else {
        this.load.visits = 0;
      }
    });
  }

  getFriends() {
    this.load.friends = 1;
    this.api.get(`alumni/friends?count=${this.friends.length}`).subscribe((res: any[]) => {
      this.friends = this.friends.concat(res).filter((friend) => !this.blocks.find((block) => friend.id === block.id));
      if (res.length < 20) {
        this.load.friends = 2;
      } else {
        this.load.friends = 0;
      }
    });
  }

  getPendings() {
    this.load.pendings = 1;
    this.api.get(`alumni/pendings?count=${this.pendings.length}`).subscribe((res: any[]) => {
      this.pendings = this.pendings.concat(res);
      if (res.length < 20) {
        this.load.pendings = 2;
      } else {
        this.load.pendings = 0;
      }
    });
  }

  getBlocks() {
    this.load.blocks = 1;
    this.api.get(`alumni/blocks?count=${this.blocks.length}`).subscribe((res: any[]) => {
      console.log("Res: ", res)
      this.blocks = this.blocks.concat(res)
      if (res.length < 20) {
        this.load.blocks = 2;
      } else {
        this.load.blocks = 0;
      }
    })
  }

  approveFriendRequest(u) {
    this.api.post('friend/approve', {
      fid: u.id
    }).subscribe((res) => {
      console.log("Approve friend request res", res)
      const index = this.requests.findIndex(x => x.id === u.id);
      this.requests.splice(index, 1);
      if (this.friends.length) {
        this.friends = [...this.friends, u];
      }
      this.dataSv.updateFreqCount(false);
      this.dataSv.updateFriendsCount(true);
      this.dataSv.updateFriendRequest(this.requests);
      alert("Successfully added your friend!")
    }, err => {
      if (err.status >= 200 && err.status <= 299) {
        console.log("Approve friend request w/ error", err)
        const index = this.requests.findIndex(x => x.id === u.id);
        this.requests.splice(index, 1);
        if (this.friends.length) {
          this.friends = [...this.friends, u];
        }
        this.dataSv.updateFreqCount(false);
        this.dataSv.updateFriendsCount(true);
        this.dataSv.updateFriendRequest(this.requests);
        alert("Successfully added your friend!")
      } else {
        alert("An error has occurred. Error: " + JSON.stringify(err))
      }
    });
  }

  ignoreFriendRequest(u) {
    this.api.post('friend/ignore', {
      fid: u.id
    }).subscribe((res) => {
      const index = this.requests.map(x => x.id).indexOf(u.id);
      this.requests.splice(index, 1);
      this.dataSv.updateFreqCount(false);
      this.dataSv.updateFriendRequest(this.requests);
    }, err => {
      if (err.status >= 200 && err.status <= 299) {
        const index = this.requests.map(x => x.id).indexOf(u.id);
        this.requests.splice(index, 1);
        this.dataSv.updateFreqCount(false);
        this.dataSv.updateFriendRequest(this.requests);
      } else {
        alert("An error has occurred. Error: " + JSON.stringify(err))
      }
    });
  }

  addAsFriend(u) {
    this.api.post('friend/invite', {
      fid: u.id
    }).subscribe((res) => {
      console.log("Res from add as friend", res)
      const index = this.suggests.map(x => x.id).indexOf(u.id);
      this.suggests.splice(index, 1);
      if (this.pendings.length) {
        this.pendings = [...this.pendings, u];
      }
      alert("Friend request sent!")
    }, err => {
      if (err.status >= 200 && err.status <= 299) {
        console.log("Res from add as friend", err)
        const index = this.suggests.map(x => x.id).indexOf(u.id);
        this.suggests.splice(index, 1);
        if (this.pendings.length) {
          this.pendings = [...this.pendings, u];
        }
        alert("Friend request sent!")
      } else {
        alert("An error has occurred. Error: " + JSON.stringify(err))
      }
    });
  }

  unblock(user) {
    if (confirm("Are you sure you want to unblock this user?")) {
      this.api.post(`alumni/block/${user.id}`, {block: false}).subscribe((res) => {
        if (res) {
          alert("You've successfully unblocked this user.")
          this.blocks = this.blocks.filter((block) => block.id !== user.id)
          this.navCtrl.navigateForward('/home/user/' + user.id);
        }
      }, err => {
        console.error("Error: ", err)
        alert("We could not block this user, please try again.")
      })
    }
  }

  viewProfile(user) {
    console.log("Friend: ", user)
    this.navCtrl.navigateForward('/home/user/' + user.id);
  }


}
