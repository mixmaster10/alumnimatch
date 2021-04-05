import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, NavParams } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Ad, Company } from 'src/app/company/company.page';
import { AdService } from 'src/app/_services/ad.service';
import { ApiService } from 'src/app/_services/api.service';
import { DataService, UserInfo } from 'src/app/_services/data.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { AddPostComponent } from './add-post/add-post.component';
import { FilterPostComponent } from './filter-post/filter-post.component';

@Component({
  selector: 'app-bulletinboard',
  templateUrl: './bulletinboard.page.html',
  styleUrls: ['./bulletinboard.page.scss'],
})
export class BulletinboardPage implements OnInit {
  postType = 'other';
  isLoading = true;
  isError: false;
  isLiked = false;
  posts: any[] = [];
  likes: any[] = [];
  ad: Ad;
  sponsor: Company;
  destroy: any;

  subscription: Subscription[] = []
  user: UserInfo;

  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    public modalController: ModalController,
    private adServ: AdService,
    private route: ActivatedRoute,
    private router: Router,
    private _sanitizer: DomSanitizer,
    private utilServ: UtilsService,
    private dataServ: DataService,
    private cdRef: ChangeDetectorRef,
  ) {
    const sub1 = this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.destroy = this.router.getCurrentNavigation().extras.state.id;
      }
    });
    this.subscription.push(sub1)
    this.isLoading = true;
  }

  ngOnInit() {
    this._getLikes();
    this.getPosts(this.postType === 'other' ? false : true);
    const sub2 = this.dataServ.userStatusObs.subscribe((user) => {
      user.user.college = JSON.parse(localStorage.college)
      this.user = user
      console.log("Current User: ", this.user)
      this.cdRef.detectChanges();

    })
    this.subscription.push(sub2)
  }

  ionViewWillEnter() {
    if(this.destroy){
      this.posts = this.posts.filter((p) => p.id !== this.destroy)
    }
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

  changePostType($event) {
    this.isLoading = true;
    this.posts = [];
    this.postType = $event.target.value;
    if($event.target.value === 'other'){
      this.getPosts(false);
    }
    else if($event.target.value === 'own'){
      this.getPosts(true);
    }
    else {
      this._handleFilter();
    }
  }

  getPosts(isAuthPost: boolean) {
    this.isLoading = true;
    this.api.post('post', { isAuthPost }).subscribe(
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
        this.posts.forEach(post => {
          if(post.embed){
            this.sanitize(post);
          }
        });
        console.log(this.posts);
      },
      (err) => {
        console.error('getpostdataError', err);
        this.isLoading = false;
        this.isError = err.error.message;
      }
    );
  }

  composePost(postId: number) {
    this.navCtrl.navigateForward(`/home/bulletinboard/details/${postId}`);
  }

  async _handleNewPost() {
    console.log('test');
    const modal = await this.modalController.create({
      component: AddPostComponent,
    });

    modal.onDidDismiss().then(() => {
      this.getPosts(true);
      this.postType = 'own';
    });

    return await modal.present();
  }

  async _handleFilter() {
    console.log('filtering...');
    const modal = await this.modalController.create({
      component: FilterPostComponent,
    });
    modal.onDidDismiss().then((posts) => {
      this.posts = posts.data;
      this.isLoading = false;
    });

    return await modal.present();
  }

  _checkLike(postId) {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    let loggedUserId = currentUser.id;
    console.log('likes', this.likes.filter((l) => l.likedBy === loggedUserId && l.postId === postId).length);
    let isLiked = this.likes.filter((l) => l.likedBy === loggedUserId && l.postId === postId).length;
    return isLiked === 0 ? false : true;
  }

  _getLikes() {
  
    this.api.get(`post/likes`).subscribe(
      (res: any) => {
        this.likes = res.data;
        this.isLoading = false;
        console.log('likes', res);
      },
      (err) => {
        console.error('get_post_error', err);
        this.isLoading = false;
        this.isError = err.error.message;
      }
    );
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
            this.isError = err.error.message;
          }
          this.utilServ.hideLoading()
        }
      );
    }
  }

  sanitize(post){
    if(post.embed){
      post.safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl("https://www."+post.embed);
      console.log(post.safeUrl);
    }
  }
}
