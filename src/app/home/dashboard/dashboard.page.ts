import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';
import { DataService } from 'src/app/_services/data.service';
import { NavController, ModalController } from '@ionic/angular';
import { LocationOptionModalComponent } from 'src/app/_shared/location-option-modal/location-option-modal.component';
import { Subscription } from 'rxjs/internal/Subscription';
import { PushService } from 'src/app/_services/push.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { MessageService } from 'src/app/_services/message.service';
import { PickLocationModalComponent } from 'src/app/_shared/pick-location-modal/pick-location-modal.component';
import { Ad, Company } from 'src/app/company/company.page';
import { AdService } from 'src/app/_services/ad.service';
import { AddPostComponent } from '../bulletinboard/add-post/add-post.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {

  visitors: any[] = []
  nears: any[] = []
  messages: any[] = []
  user: any;
  college: any;
  friend_requests: any[] = []
  subscriptions: Subscription[] = [];
  ad: Ad;
  adSponsor: Company;
  isLiked = false;
  isLoading = true;
  posts: any[] = [];
  likes: any[] = [];
  postType = 'other';
  lastGrabbedData: Date;

  constructor(
    private api: ApiService,
    private dataSv: DataService,
    private cdRef: ChangeDetectorRef,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private push: PushService,
    private utils: UtilsService,
    private adServ: AdService,
    public messageService: MessageService,
    public modalController: ModalController,
    private utilServ: UtilsService
  ) { }

  ngOnInit() {
    this.college = JSON.parse(localStorage.college);
    console.log("College", this.college)
    this.subscriptions.push(this.dataSv.userStatusObs.subscribe((res) => {
      if (res) {
        res.user.college = JSON.parse(localStorage.college)
        this.user = res.user
        
        this.cdRef.detectChanges();
      }
      
    }));
    this.subscriptions.push(this.push.freqAccepted.subscribe((res) => {
      const freqIndex = this.friend_requests.map(x => x.id).indexOf(res.id);
      if (freqIndex > -1) {
        this.friend_requests.splice(freqIndex, 1);
      }
      this.getDashboardData();
    }));
    this.subscriptions.push(this.push.freqReceived.subscribe((res) => {
      this.friend_requests = [...this.friend_requests, res];
    }));
    this.subscriptions.push(this.push.messageReceived.subscribe((res) => {
      this.messages = [...this.messages, res];
      this.getDashboardData();
    }));
    this.subscriptions.push(this.push.locationUpdated.subscribe((res) => {
      const nearIndex = this.nears.map(x => x.id).indexOf(res.id);
      if (nearIndex > -1) {
        this.nears[nearIndex] = res;
      } else {
        this.nears = [...this.nears, res];
      }
      this.getDashboardData();
    }));
    this.subscriptions.push(this.dataSv.nearsChange.subscribe((res) => {
      this.nears = res;
      this.getDashboardData();
    }));
    this.subscriptions.push(this.dataSv.freqsChange.subscribe((res) => {
      this.friend_requests = res;
      this.getDashboardData();
    }));
    this.subscriptions.push(this.dataSv.msgRead.subscribe((res) => {
      this.messages.forEach((msg) => {
        if (msg.id === res) {
          msg.read = true;
        }
      });
      this.getDashboardData();
    }));
    this.getDashboardData();

    this._getLikes();
    this.getPosts();

    /*Here's some info, since this is pretty useful.
     * https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
     * IntersectionObserver tracks the viewport, and if an element enters or leaves the viewport,
     * this observer is called and executes the code below.
     **/
    let options = {
      rootMargin: '0px',
      threshhold: 0
    }
    
    let target = document.querySelector('.divider');
    
    let callback = (entries, observer) => { 
      entries.forEach(entry => {
        if(!entry.isIntersecting){
          let target = document.querySelector('#addPost') as HTMLElement;
          target.style.display = 'block';
        }
        else if(entry.isIntersecting){
          let target = document.querySelector('#addPost')as HTMLElement;
          target.style.display = 'none';
        }
        
      });
    };
    let observer = new IntersectionObserver(callback, options);
    observer.observe(target);
  }

  ionViewWillEnter() {
     this.adServ.getRandomAd().then((res: any) => {
      console.log("Get random ad on dashboard", res)
      if (res && res.ad) {
        this.ad = res.ad
        this.adSponsor = res.sponsor
      }      
    }).catch(err => {
      console.error("Get Ad error: ", err)
    })
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  getDashboardData() {
    if (this.lastGrabbedData && this.lastGrabbedData.getTime() + 3000 > (new Date()).getTime()) { // If grabbed data less than 3 seconds ago
      return;
    }
    this.api.get('alumni/dashboard').subscribe((res: any) => {
      console.log("Dashboard data", res)
      this.messages = res.messages;
      this.user = res.user;
      this.nears = res.nears;
      this.visitors = res.visitors;
      this.friend_requests = res.friend_requests;
      this.dataSv.updateUserData(res);
      this.cdRef.detectChanges();
    }, (err) => {
      console.error('alumni/dashboard', err);
    });
    this.lastGrabbedData = new Date()
  }

  viewProfile(data) {
    console.log('viewProfile', data);
  }

  changeLocationShow($event) {
    console.log('changeLocationPrivacy', $event);
    if ($event) {
      this.openLocationOptionModal();
    }
    this.user.coordinate.show = $event ? 1 : 0;
    this.api.get(`user/location/show/${this.user.coordinate.show}`).subscribe((res) => {
      console.log('changeLocationShow', res);
      this.dataSv.updateUserCoordinate(this.user.coordinate);
    }, (err) => {
      console.error('changeLocationShow', err);
    });
  }

  async openLocationOptionModal() {
    const modal = await this.modalCtrl.create({
      component: LocationOptionModalComponent,
      backdropDismiss: false,
      cssClass: 'location-option-modal-css'
    });
    modal.onWillDismiss().then((result) => {
      console.log('result', result);
      if (result && result.data) {
        this.getUserLocation().then((coords: any) => {
          this.api.post('user/location', {
            radius: result.data.radius,
            lat: coords.lat,
            lng: coords.lng
          }).subscribe((res) => {
            this.dataSv.updateUserCoordinate({
              lat: coords.lat,
              lng: coords.lng,
              show: this.user.coordinate.show
            });
            console.log('updateLocation', res);
          });
        }).catch(() => {
          this.api.post('user/location', {
            radius: result.data.radius,
            lat: this.user.coordinate.lat,
            lng: this.user.coordinate.lng
          }).subscribe((res) => {
            console.log('updateLocation', res);
          });
        });
      }
    });
    return await modal.present();
  }

  getUserLocation() {
    return new Promise((resolve, reject) => {
      this.utils.getCurrentPosition().then((res) => {
        resolve(res);
      }).catch(async () => {
        const modal = await this.modalCtrl.create({
          component: PickLocationModalComponent,
          backdropDismiss: false
        });
        modal.onDidDismiss().then((result) => {
          if (result && result.data) {
            console.log('result', result.data);
            resolve({
              lat: result.data.lat,
              lng: result.data.lng
            });
          } else {
            reject();
          }
        });
        modal.present();
      });
    });
  }

  goFriendPage(segment = null) {
    console.log('goFriendPage', segment);
    this.navCtrl.navigateForward(`home/friends/${segment ? segment : ''}`);
  }

  goMapPage() {
    this.navCtrl.navigateForward('home/nearme');
  }

  goLeaderboardPage() {
    this.navCtrl.navigateForward('home/leaderboard');
  }

  editProfile() {
    this.navCtrl.navigateForward('profile/view');
  }

  viewAllMessages() {
    this.navCtrl.navigateForward('home/messages');
  }

  //Imported from bulletinboard.page.ts
  _getLikes() {
    this.isLoading = true;
    this.api.get(`post/likes`).subscribe(
      (res: any) => {
        this.likes = res.data;
        this.isLoading = false;
        console.log('likes', res);
      },
      (err) => {
        console.error('get_post_error', err);
        this.isLoading = false;
      }
    );
  }
  getPosts() {
    this.isLoading = true;
    this.api.get('post/getRelevantPosts').subscribe(
      (res: any) => {
        this.posts = res.data;
        this.isLoading = false;
        const currentUser = JSON.parse(localStorage.getItem('user'));
        let loggedUserId = currentUser.id;
        var likedPosts = this.likes.filter((l) => l.likedBy === loggedUserId);
        var incr;
        for (incr = 0; incr < likedPosts.length; incr++) {
          let findPost = this.posts.find((p) => p.id === likedPosts[incr].postId);
          if(findPost)
            findPost.isLiked = true;
        }
        console.log(this.posts);
      },
      (err) => {
        console.error('getpostdataError', err);
        this.isLoading = false;
      }
    );
  }
  composePost(postId: number) {
    this.navCtrl.navigateForward(`/home/bulletinboard/details/${postId}`);
  }
  async likePost(postId) {
    await this.utilServ.showLoading()
    if (!this._checkLike(postId)) {
      let postData = {
        type: 'like',
        postId,
      };
      this.api.post('post/reaction', postData).subscribe(
        (res: any) => {
          let findPost = this.posts.find((p) => p.id === postId);
          findPost.likes_count += 1;
          findPost.isLiked = true;
          console.log(res.data);
          this._getLikes();
          console.log('like success: '+ findPost.likes_count);
          this.utilServ.hideLoading()
        },
        (err) => {
          if(err.status >= 200 && err.status <= 299) {
            let findPost = this.posts.find((p) => p.id === postId);
            findPost.likes_count += 1;
            findPost.isLiked = true;
            console.log(err);
            this._getLikes();
            console.log('like success: '+ findPost.likes_count);
          }
          else {
            console.error('getpostdataError', err);
            console.log(err.error.message);
          }
          this.utilServ.hideLoading()
        }
      );
    } else {
      let postData = {
        type: 'unlike',
        postId,
      };
      this.api.post('post/reaction', postData).subscribe(
        (res: any) => {
          let findPost = this.posts.find((p) => p.id === postId);
          findPost.likes_count -= 1;
          findPost.isLiked = false;
          console.log(res.data);
          this._getLikes();
          console.log('like success: '+ findPost.likes_count);           
            //this.liked_users = this.likes.map((like) => {return like.like_by})

          console.log(res.message);
          this.utilServ.hideLoading()
        },
        (err) => {
          console.error('getpostdataError', err);
          if (err.status >= 200 && err.status <= 299) {


              let findPost = this.posts.find((p) => p.id === postId);
              findPost.likes_count -= 1;
              findPost.isLiked = false;
              console.log(err);
              this._getLikes();
              console.log('like success: '+ findPost.likes_count);
              //this.liked_users.push({...this.currentUser, online: 1})
          } else {
            alert("An error has occurred. Error: " + JSON.stringify(err))
            console.error('getpostdataError' + ' ' + err.status, err);
          }
          this.utilServ.hideLoading()
        }
      );
    }
  }
  _checkLike(postId) {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    let loggedUserId = currentUser.id;
    console.log('likes', this.likes.filter((l) => l.likedBy === loggedUserId && l.postId === postId).length);
    let isLiked = this.likes.filter((l) => l.likedBy === loggedUserId && l.postId === postId).length;
    return isLiked === 0 ? false : true;
  }

  async _handleNewPost() {
    console.log('test');
    const modal = await this.modalController.create({
      component: AddPostComponent,
    });

    modal.onDidDismiss().then(() => {
      this.getPosts();
    });

    return await modal.present();
  }
}
