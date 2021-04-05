import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonContent, ToastController, PopoverController } from '@ionic/angular';
import { ApiService } from 'src/app/_services/api.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: 'post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;

  comments: any[] = [];
  likes: any[] = [];
  comment: any = {};
  reportReason: string;
  isLoading = true;
  isFocus = false;
  isError = false;
  isDisabled = true;
  post: any = {};

  JSON: any;

  authPost: boolean = false

  currentUser: any;

  liked_users: any[] = []

  constructor(
    private navCtrl: NavController, 
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private alertController: AlertController,
    public toastController: ToastController,
    private _sanitizer: DomSanitizer,
    private utilServ: UtilsService
  ) {
    this.JSON = JSON;

    const isFocus = this.route.snapshot.paramMap.get('focus');
    console.log('isFocus', isFocus);
    this.isFocus = isFocus === 'focus' ? true : false;

    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.comment = { ...this.comment, comment_user: this.currentUser };
    console.log(this.currentUser);
  }

  ngOnInit() {
    const postId = this.route.snapshot.paramMap.get('id');
    this._getPost(postId);
    this._getComments(postId);
    this._getLikes(postId);
  }

  ScrollToBottom() {
    this.content.scrollToBottom(1500);
  }

  _handleMessageInput(e) {
    this.isDisabled = e.target.value.length === 0 ? true : false;
    this.comment = { ...this.comment, [e.target.name]: e.target.value };
  }

  _getPost(postId) {
    this.isLoading = true;
    this.api.post(`post/${postId}`, { isAuth: true }).subscribe(
      (res: any) => {
        this.post = { ...res.data };
        this.isLoading = false;
        console.log("Post", res);
        if(this.post.embed){
          this.sanitize(this.post);
        }

        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser.id === this.post.user.id) {
          this.authPost = true
        }

      },
      (err) => {
        console.error('get_post_error', err);
        this.isLoading = false;
        this.isError = err.error.message;
      }
    );
  }

  _checkLike() {
    const loggedUserId = this.comment.comment_user.id;
    console.log('loggedUserId', loggedUserId);
    console.log('likes', this.likes);
    const isLiked = this.likes.findIndex((l) => l.likedBy === loggedUserId);

    this.post.isLiked = isLiked !== -1
  }

  _getLikes(postId) {
    this.isLoading = true;
    this.api.get(`post/likes/${postId}`).subscribe(
      (res: any) => {
        this.likes = res.data;
        this.isLoading = false;
        this._checkLike();
        console.log(res);
        this.liked_users = this.likes.map((like) => {return like.like_by})
      },
      (err) => {
        console.error('get_post_error', err);
        this.isLoading = false;
        this.isError = err.error.message;
      }
    );
  }

  _getComments(postId) {
    this.isLoading = true;
    this.api.get(`post/comments/${postId}`).subscribe(
      (res: any) => {
        this.comments = res.data;
        this.isLoading = false;
        console.log(res);
      },
      (err) => {
        console.error('get_post_error', err);
        this.isLoading = false;
        this.isError = err.error.message;
      }
    );
  }

  async likePost(postId, type = 'like') {
    await this.utilServ.showLoading()
    let postData: any = {
      type,
      postId
    };

    if (type === 'comment') {
      postData.comment = this.comment.comment;
    }

    if (!this.post.isLiked || type === 'comment') {
      this.api.post('post/reaction', postData).subscribe(
        (res: any) => {
          if (type === 'comment') {
            this.comment.created_at = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
            this.comments = [...this.comments, this.comment];
            this.comment = {comment_user: this.currentUser  };
            this.isDisabled = true;
          }

          if (type === 'like') {
            this.post.likes_count = this.post.likes_count + 1;
            this.post.isLiked = true;
            console.log(res)
            this.liked_users.push({...this.currentUser, online: 1})
            //this.liked_users = this.likes.map((like) => {return like.like_by})
          }

          console.log(res.message);
          this.utilServ.hideLoading()
        },
        (err) => {
          console.error('getpostdataError', err);
          if (err.status >= 200 && err.status <= 299) {
            if (type === 'comment') {
              this.comment.created_at = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en');
              this.comments = [...this.comments, this.comment];
              this.comment = {comment_user: this.currentUser };
              this.isDisabled = true;
            }

            if (type === 'like') {
              this.post.likes_count = this.post.likes_count + 1;
              this.post.isLiked = true;
              this.liked_users.push({...this.currentUser, online: 1})
            }
          } else {
            alert("An error has occurred. Error: " + JSON.stringify(err))
            console.error('getpostdataError' + ' ' + err.status, err);
            this.isError = err.error.message;
          }
          this.utilServ.hideLoading()
        }
      );
    } else if (this.post.isLiked && type === 'like') {
      postData.type = 'unlike'
      this.api.post('post/reaction', postData).subscribe(
        (res: any) => {

            this.post.likes_count = this.post.likes_count - 1;
            this.post.isLiked = false;
            console.log(res)
            const index = this.liked_users.findIndex((user) => this.currentUser.id === user.id)
            if (index !== -1) {
              this.liked_users.splice(index, 1)
            }            
            //this.liked_users = this.likes.map((like) => {return like.like_by})
          

          console.log(res.message);
          this.utilServ.hideLoading()
        },
        (err) => {
          console.error('getpostdataError', err);
          if (err.status >= 200 && err.status <= 299) {

            if (type === 'like') {
              this.post.likes_count = this.post.likes_count - 1;
              this.post.isLiked = false;
              const index = this.liked_users.findIndex((user) => this.currentUser.id === user.id)
              if (index !== -1) {
                this.liked_users.splice(index, 1)
              }
              //this.liked_users.push({...this.currentUser, online: 1})
            }
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

  async reportPost(postId) {
    const report = await this.presentAlert();
    const type = "report";
    var reason = this.reportReason;
    const postData: any = {
      type,
      postId,
      reason
    };
    console.log(postData);
    if(postData.reason !== "") {
      this.api.post('post/reaction', postData).subscribe(
        (res: any) => {
          this.presentToast();
          console.log(res);
        },
        (err) => {
          console.error('reportPostError', err);
          this.presentToast();
          this.isError = err.error.message;
        }
      );
    }
    else
      return; //Do nothing
  }

  removePost() {
    if (confirm("Are you sure you want to remove this post? This cannot be undone.")) {
      this.api.delete(`post/remove/${this.post.id}`).subscribe((res) => {
        console.log(res)
        if (res) {
          alert("Post successfully removed!")
          this.goBackandDelete()
        } else {
          alert("We could not remove your post. Please try again.")
        }
      }, err => {
        console.error(err)
        alert("Error removing your post. Error: " + JSON.stringify(err))
      })
    }
  }

  async presentAlert() {
    console.log("creating alert modal");
    const alert = await this.alertController.create({
      cssClass: 'reportAlert',
      header: 'Report',
      message: '<i>AlumniMatch does not tolerate harmful or dangerous content.</i> <p>Thank you for protecting our community!</p>',
      buttons: [
        {
          text: 'It infringes my rights',
          handler: () => {
            this.reportReason = "It infringes my rights";
          }
        },
        {
          text: "It's offensive or harmful",
          handler: () => {
            this.reportReason = "It's offensive or harmful";
          }
        }, 
        {
          text: "It's misleading",
          handler: () => {
            this.reportReason = "It's misleading";
          }
        },
        {
          text: "It's suspicious or Spam",
          handler: () => {
            this.reportReason = "It's suspicious or Spam";
          }
        },
        {
          text:"Cancel",
          role:"cancel",
          cssClass:"cancel",
          handler: () => {
            this.reportReason = "";
          }
        }]
    }).then((e) => {
      e.present();
      return e.onDidDismiss();
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Post Successfully Reported.',
      color: 'success',
      duration: 2000,
      position: 'middle',
    });
    toast.present();
  }

  viewProfile(user) {
    console.log(user)
    if (user.id === this.currentUser.id) {
      return;
    }
    
    this.navCtrl.navigateForward('/home/user/' + user.id);
  }

  goBack() {
    this.navCtrl.navigateBack(`/home/bulletinboard`);
  }

  goBackandDelete() {
    let navigationExtras: NavigationExtras = {
      state: {
        id: this.post.id
      }
    };
    this.router.navigate([`/home/bulletinboard`], navigationExtras);
  }
  sanitize(post){
    if(post.embed){
      post.safeUrl = this._sanitizer.bypassSecurityTrustResourceUrl("https://www."+post.embed);
      console.log(post.safeUrl);
    }
  }
}
