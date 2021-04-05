import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/_services/api.service';
import { ActivatedRoute } from '@angular/router';
import { PushService } from 'src/app/_services/push.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-privacy-requests',
  templateUrl: './privacy-requests.page.html',
  styleUrls: ['./privacy-requests.page.scss'],
})
export class PrivacyRequestsPage implements OnInit {

  fsegment = 'all';

  users: any[] = [];
  requests: any[] = [];
  approved: any[] = [];
  pendings: any[] = [];

  load: any = {};
  subscriptions: Subscription[] = [];

  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private route: ActivatedRoute,
    private push: PushService,
    private dataSv: DataService
  ) {
    console.log(location.href);
    const segment = this.route.snapshot.paramMap.get('segment');
    console.log('this.fsegment', segment);
    if (segment) {
      this.fsegment = segment;
    } else {
      this.fsegment = 'all';
    }
  }

  ngOnInit() {
    this.initLoadData(this.fsegment);
    this.subscriptions.push(this.push.freqAccepted.subscribe((res) => {
      const freqIndex = this.requests.map(x => x.id).indexOf(res.id);
      if (freqIndex > -1) {
        this.requests.splice(freqIndex, 1);
      }
      this.approved = [...this.approved, res];
    }));
    this.subscriptions.push(this.push.freqReceived.subscribe((res) => {
      this.requests = [...this.requests, res];
    }));
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
          this.getAllRequest();
        }
        break;
      case 'requests':
        if (!this.requests.length) {
          this.getRequests();
        }
        break;
      case 'approved':
        if (!this.approved.length) {
          this.getApproved();
        }
        break;
      case 'pendings':
        if (!this.pendings.length) {
          this.getPendings();
        }
        break;
    }
  }

  getAllRequest() {
    this.load.users = 1;
    this.api.get(`user/get-access-requests`).subscribe((res: any[]) => {
      console.log("Access Requests", res)
      this.users = this.users.concat(res);
      if (res.length < 20) {
        this.load.users = 2;
      } else {
        this.load.users = 0;
      }
    });
  }

  getRequests() {
    this.load.requests = 1;
    this.api.get(`user/get-access-requests`).subscribe((res: any[]) => {
      this.requests = this.requests.concat(res.filter(e=> e.approved === true));
      if (res.length < 20) {
        this.load.requests = 2;
      } else {
        this.load.requests = 0;
      }
    });
  }

  getApproved() {
    this.load.friends = 1;
    this.api.get(`user/get-access-requests`).subscribe((res: any[]) => {
      this.approved = this.approved.concat(res.filter(e=> e.approved === true));
      if (res.length < 20) {
        this.load.approved = 2;
      } else {
        this.load.approved = 0;
      }
    });
  }

  getPendings() {
    this.load.pendings = 1;
    this.api.get(`user/get-access-requests`).subscribe((res: any[]) => {
      this.pendings = this.pendings.concat(res.filter(e=> e.approved === false));
      if (res.length < 20) {
        this.load.pendings = 2;
      } else {
        this.load.pendings = 0;
      }
    });
  }

  approveRequest(u) {
    this.api.post('user/access-request', {
      requested_user: u.requested_user,
      access: u.access,
      approve: true
    }).subscribe((res) => {
      const index = this.requests.map(x => x.id).indexOf(u.id);
      this.requests.splice(index, 1);
      if (this.approved.length) {
        this.approved = [...this.approved, u];
      }
    });
  }

  viewProfile(user) {
    this.navCtrl.navigateForward('/home/user/' + user.id);
  }

}
