import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from '../_services/api.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { UtilsService } from '../_services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  verified = true;
  weights = {
    ps: 25,
    cl: 75
  }; // [PastSchool, CurrentLife];
  weightControl: FormControl = new FormControl(25);
  completes: {ps: boolean, cl: boolean} = {ps: false, cl: false}

  constructor(
    private nav: NavController,
    private api: ApiService,
    private utils: UtilsService
  ) { }

  ngOnInit() {
    this.getWeights();
    if (localStorage.verified) {
      this.verified = true;
    } else {
      this.verified = false;
    }
    this.weightControl.valueChanges.pipe(debounceTime(500)).subscribe((e) => {
      console.log('change weights', this.weights);
      this.saveWeights();
    });

  }

  ionViewWillEnter() {
    this.getCompletes()
  }

  getCompletes() {
    this.api.get('user/completed/ps').subscribe((res) => {
      console.log('user/completed/ps', JSON.stringify(res));
      
      if (res) {
        let ps = res as {
          degrees: boolean,
          orgs: boolean,
          athletes: boolean,
          colleges: boolean,
        };
        console.log(Object.values(ps), Object.values(ps).findIndex(field => field === false))
        if (Object.values(ps).findIndex(field => field === false) !== -1) {
          this.completes.ps = false
        } else {
          this.completes.ps = true
        }
      }
    }, (err) => {
      console.error('user/completed/ps', err);
    });

    this.api.get('user/completed/cl').subscribe((res) => {
      console.log('user/completed/cl', res);
      if (res) {
        if (res.health) {
          delete res.health // Taking out health questions
        }
        this.completes.cl = true

        let cl = res as {activities?: boolean, career?: boolean}
        //if (Object.values(cl).findIndex(field => field === false) !== -1) {
          for (let field in cl) {
            if (cl[field] === false && (field !== 'home' && field !== 'hometown' && field !== 'learn' && field !== 'school')) {
              this.completes.cl = false
            }
          }
        //}
      }
    }, (err) => {
      console.log('users/completed/cl', err);
    });

  }

  getWeights() {
    this.api.get('user/weights', true).subscribe((res: any) => {
      console.log('user/weights', res);
      if (res) {
        this.weights = res;
      }
    }, (err) => {
      console.error('user/weights', err);
    });
  }

  changeWeight($event) {
    if ($event.target.value > 100) {
      this.weights.ps = 100;
      this.weights.cl = 0;
    } else if ($event.target.value < 0) {
      this.weights.ps = 0;
      this.weights.cl = 100;
    } else {
      this.weights.cl = 100 - this.weights.ps;
    }
  }

  saveWeights() {
    this.api.post('user/weights', this.weights).subscribe((res) => {
      console.log('saveWeights', res);
    }, (err) => {
      console.error('saveWeights', err);
    });
  }

  onSubmit() {
    this.api.get('user/completed', true).subscribe((res: {percent: number, uncompleted: string[]}) => {
      console.log('user/completed', res);
      let index = res.uncompleted.findIndex((category) => category === 'Health')
      if (index > -1) {
        res.uncompleted.splice(index, 1)
      }
      index = res.uncompleted.findIndex((category) => category === 'Home Base Location')
      if (index > -1) {
        res.uncompleted.splice(index, 1)
      }
      index = res.uncompleted.findIndex((category) => category === 'Hometown')
      if (index > -1) {
        res.uncompleted.splice(index, 1)
      }
      index = res.uncompleted.findIndex((category) => category === 'Language Learning')
      if (index > -1) {
        res.uncompleted.splice(index, 1)
      }
      index = res.uncompleted.findIndex((category) => category === 'School Related Question')
      if (index > -1) {
        res.uncompleted.splice(index, 1)
      }

      if (res.uncompleted && res.uncompleted.length) {
        this.utils.presentErrorAlert(
          `You must answer all questions in user registration before being able to fully Submit. Please finish registration, thanks!
          ${res.uncompleted && res.uncompleted.length ? ('<br>Uncompleted: ' + res.uncompleted.join(', ')) : ''}`
        );
      } else {
        this.nav.navigateForward('/auth/final');
      }
    }, (err) => {
      console.error('user/completed', err);
    });
  }

  goProfileEdit(m: number) {
    switch (m) {
      case 0:
        this.nav.navigateForward('/profile/past-school');
        break;
      case 1:
        this.nav.navigateForward('/profile/current-life');
        break;
      /* case 2:
        this.nav.navigateForward('/profile/causes');
        break; */
      default:
        console.log(`Not a case - number: ${m}`)
        break;
    }
  }

}
