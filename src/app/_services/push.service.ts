import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { ApiService } from './api.service';
import { IonicModule, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  messageReceived: Subject<any> = new Subject();
  freqReceived: Subject<any> = new Subject();
  freqAccepted: Subject<any> = new Subject();
  locationUpdated: Subject<any> = new Subject();
  newJoined: Subject<any> = new Subject();
  privacyRequest: Subject<any> = new Subject();

  constructor(
    private onesignal: OneSignal,
    private api: ApiService,
    private dataSv: DataService,
    private navCtrl: NavController
  ) {}

  initialize() {
    const iosSettings = {
      kOSSettingsKeyAutoPrompt: true,
      kOSSettingsKeyInAppLaunchURL: true
    };
    this.onesignal.startInit('440fffbf-364b-425c-8b87-b1359f9426d8');
    this.onesignal.iOSSettings(iosSettings);
    this.onesignal.inFocusDisplaying(this.onesignal.OSInFocusDisplayOption.Notification);
    this.onesignal.handleNotificationOpened().subscribe((data) => {
      this.handleNotificationOpened(data);
    });
    this.onesignal.handleNotificationReceived().subscribe((data) => {
      this.handleNotificationReceived(data);
    });

    
    this.onesignal.endInit();
  }

  getIds() {
    this.onesignal.getIds().then((res) => {
      console.log('onesignal IDs:', res);
      this.api.get('user/push/token/' + res.userId).subscribe((response) => {
        localStorage.setItem('device_token', res.userId);
        console.log('onesignal res', response);
      }, err => {
        console.error('onesignal', err);
      });
    }).catch((err) => {
      console.error('onesignal can\'t get id', err);
    });
  }

  handleNotificationOpened(jsonData) {
    console.log('handleNotificationOpened', jsonData);
    if (jsonData.notification.payload.additionalData != null) {
      const pushData = jsonData.notification.payload.additionalData;
      console.log('notification received data', pushData);
      switch (pushData.type) {
        case 1:
          this.navCtrl.navigateForward(`home/messages/user/${pushData.data.sid}`);
          break;
        case 2:
          this.navCtrl.navigateForward(`home/friends/requests`);
          break;
        case 3:
          this.navCtrl.navigateForward(`home/friends/friends`);
          break;
        case 4:
          this.navCtrl.navigateForward(`home/nearme`);
          break;
        case 5:
          this.navCtrl.navigateForward(`home/user/${pushData.data.id}`);
          break;
       case 10:
          this.navCtrl.navigateForward(`home/privacy-requests`);
          break;
      }
    }
  }

  handleNotificationReceived(data) {
    const pushData = data.payload.additionalData;
    console.log('notification received data', pushData);
    switch (pushData.type) {
      case 1:
        const message = pushData.data;
        this.dataSv.updateMessagesCount(true);
        this.messageReceived.next(message);
        break;
      case 2:
        this.dataSv.updateFreqCount(true);
        this.freqReceived.next(pushData.data);
        break;
      case 3:
        this.dataSv.updateFreqCount(false);
        this.freqAccepted.next(pushData.data);
        break;
      case 4:
        this.locationUpdated.next(pushData.data);
        break;
      case 5:
        this.newJoined.next(pushData.data);
        break;
      case 10:
        this.privacyRequest.next(pushData.data);
        break;
    }
  }

}
