import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { DataService } from 'src/app/_services/data.service';
import { ApiService } from 'src/app/_services/api.service';
import { LocationOptionModalComponent } from 'src/app/_shared/location-option-modal/location-option-modal.component';
import { CLUSTERER_STYLES } from 'src/app/_config/clusterer.style';
import { AlumniModalComponent } from 'src/app/_shared/alumni-modal/alumni-modal.component';
import { PushService } from 'src/app/_services/push.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { UtilsService } from 'src/app/_services/utils.service';
import { PickLocationModalComponent } from 'src/app/_shared/pick-location-modal/pick-location-modal.component';

@Component({
  selector: 'app-nearme',
  templateUrl: './nearme.page.html',
  styleUrls: ['./nearme.page.scss'],
})
export class NearmePage implements OnInit, OnDestroy {

  is_hide = true;
  center: any;
  map: any;
  nears: any[];
  clusterer_styles = CLUSTERER_STYLES;
  pushSubscription: Subscription;

  constructor(
    private navCtrl: NavController,
    private dataSv: DataService,
    private api: ApiService,
    private utils: UtilsService,
    private modalCtrl: ModalController,
    private push: PushService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.center = this.dataSv.getUserCoords();
    if (!this.center) {
      this.utils.getCurrentPosition().then((coords: any) => {
        this.center = coords;
      });
    }

    this.getNears();
    this.pushSubscription = this.push.locationUpdated.subscribe((res) => {
      console.log('locationUpdated', res);
      const index = this.nears.map(x => x.id).indexOf(res.id);
      if (index > -1) {
        this.nears.unshift(res);
      } else {
        this.nears[index] = res;
      }
      this.cdRef.detectChanges();
    });
  }

  ngOnDestroy() {
    this.pushSubscription.unsubscribe();
  }

  back() {
    this.navCtrl.navigateBack('/home');
  }

  mapReady(e) {
    this.map = e;
  }

  getNears() {
    if (!this.nears) {
      this.api.get('alumni/nears').subscribe((res: any[]) => {
        console.log('getNears', res);
        this.nears = res;
        this.dataSv.updateNears(res);
      }, (err) => {
        console.log('getNears', err);
      });
    }
  }

  async updateLocation() {
    this.is_hide = true;
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
              show: this.center.show
            });
            console.log('updateLocation', res);
          });
        }).catch(() => {
          this.utils.presentErrorAlert('Please select your location');
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

  async showAlumniModal(user) {
    const modal = await this.modalCtrl.create({
      component: AlumniModalComponent,
      componentProps: {user},
      cssClass: 'alumni-modal-css'
    });
    return await modal.present();
  }

  viewProfile($event) {
    this.navCtrl.navigateForward('/home/user/' + $event.id);
  }

}
