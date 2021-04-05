import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/_services/api.service';
import { ATHLETE_POSITIONS } from 'src/app/_config/athletes.constant';
import * as ClConstants from 'src/app/_config/current-life.constant';
import { SimilarUsersModalComponent } from '../_components/similar-users-modal/similar-users-modal.component';
import { UtilsService } from 'src/app/_services/utils.service';
import { DataService } from 'src/app/_services/data.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss'],
})
export class ViewProfileComponent implements OnInit, OnDestroy {

  user: any;
  friends: any[];
  ps: any;
  cl: any;
  psegment = 'ps';

  subscriptions: Subscription[] = []

  DEGREE_TYPES = ['Bachelors', 'Masters', 'Doctoral'];
  ATHLETE_POSITIONS = ATHLETE_POSITIONS;
  ATHLETE_MEMBERS = ['YES - Athlete', 'Yes - Staff', 'No - But big fan', 'NO - Don\'t care'];

  WORK_FOR = ClConstants.WORK_FORS;
  BUYING_STUFFS = ClConstants.BUYING_STUFFS;
  CUSTOMERS = ClConstants.CUSTOMERS;
  EMPLOYMENT_STATUSES = ClConstants.EMPLOYMENT_STATUSES;
  HIRE_FULL_COUNT = ClConstants.HIRE_MONTHLY;
  HIRE_FULL_FOR = ClConstants.HIRE_FORS;
  GIG_PROJECTS = ClConstants.GIG_PROJECTS;
  HIRE_INTERN_COUNT = ClConstants.HIRE_MONTHLY;
  OWN_BUSINESS = ClConstants.OWN_BUSINESSES;
  REVIEW_PLANS = ClConstants.REVIEW_PLANS;
  WEALTHS = ClConstants.WEALTHS;
  WORK_TITLES = ClConstants.WORK_TITLES;

  GENDERS = ClConstants.GENDERS;
  AGEGROUPS = ClConstants.AGEGROUPS;
  ETHNICITIES = ClConstants.ETHNICITIES;
  LANGUAGES = ClConstants.LANGUAGES;
  RELIGIONS = ClConstants.RELIGIONS;
  RELATIONSHIPS = ClConstants.RELATIONSHIPS;
  MENTAL_EXERCISES = ClConstants.MENTAL_EXERCISES;
  PHYSICAL_EXERCISES = ClConstants.PHYSICAL_EXERCISES;
  CAUSES = ClConstants.CAUSES;
  SATIS_LEVELS = ClConstants.SATIS_LEVELS;

  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private modalCtrl: ModalController,
    private utils: UtilsService,
    private cdRef: ChangeDetectorRef,
    private dataSv: DataService,
    private auth: AuthService
  ) { }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe()
    })
  }

  ngOnInit() {
    this.getUserData();
  }

  takePhoto() {
    this.utils.takePhoto(true).then((imageData) => {
      this.user.avatar = 'data:image/jpeg;base64,' + imageData;
      this.api.post('user/avatar', {
        data: imageData
      }, true).subscribe((res) => {
        console.log('uploadResult', res);
        this.user.avatar = res + '?' + (new Date().getTime());
        this.dataSv.updateUserAvatar(this.user.avatar);
      }, (error) => {
        console.error('uploadAvatarError', error);
      });
    }).catch((err) => {
      console.error('err', err);
    });
  }

  editProfile() {
    this.navCtrl.navigateForward('/profile');
  }

  back() {
    this.navCtrl.navigateBack('/home');
  }

  getUserData() {
    console.log(this.dataSv)
    const sub1 = this.dataSv.userStatusObs.subscribe((res: any) => { 
      console.log('getUserData', res);
      if (res) {
        this.user = res.user;
        this.friends = res.friends;
        this.ps = res.ps;
        this.cl = res.cl;
        this.cdRef.detectChanges();
      }
      
    }, (err) => {
      console.error('user', err);
    });

    this.subscriptions.push(sub1)
  }

  segmentChanged($event) {
    console.log('segmentChanged', $event.target.checked);
  }

  async findSimilarUsers(category, object) {
    console.log(category, object);
  
    const modal = await this.modalCtrl.create({
      component: SimilarUsersModalComponent,
      backdropDismiss: false,
      componentProps: {category, cid: object.id, cname: object.name}
    });
    return await modal.present();
  }

  viewProfile(user) {
    this.navCtrl.navigateForward('/home/user/' + user.id);
  }

  removeAccount() {
    if (confirm("Are you sure you want to remove your account? This will remove all your messages and posts as well. \n This cannot be undone.")) {
      this.api.delete('user/delete', true).subscribe((resp) => {
        console.log(resp)
        if (resp) {
          this.auth.signout();
        } else {
          alert("Error deleting your account. Please try again.")
        }
      }, (err) => {
        console.error(err)
        alert("Error deleting your account. Error: " + JSON.stringify(err))
      })
    }
  }
  
}
