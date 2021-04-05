import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, LoadingController, AlertController, ToastController, ModalController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private geolocation: Geolocation,
    private modalCtrl: ModalController
  ) { }

  takePhoto(isRatio = true) {
    return new Promise( async (resolve, reject) => {
      const actionSheet = await this.actionSheetCtrl.create({
        mode: 'md',
        header: 'Take Photo from',
        buttons: [{
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            console.log('take photo from camera');
            this._getCameraPicture('camera', isRatio).then((imageData) => {
              resolve(imageData);
            }).catch((err) => {
              reject(err);
            });
          }
        }, {
          text: 'Gallery',
          icon: 'images',
          handler: () => {
            console.log('take photo from gallery');
            this._getCameraPicture('gallery', isRatio).then((imageData) => {
              resolve(imageData);
            }).catch((err) => {
              reject(err);
            });
          }
        }],
        cssClass: 'take-photo-action-sheet'
      });
      await actionSheet.present();
    });
  }

  private _getCameraPicture(sourceType, isRadio) {
    return new Promise((resolve, reject) => {
      let cameraOption: CameraOptions;
      if (sourceType === 'camera') {
        cameraOption = {
          quality: 100,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          targetWidth: 200,
          targetHeight: 200,
          allowEdit: true,
          sourceType: this.camera.PictureSourceType.CAMERA
        };
      } else {
        cameraOption = {
          quality: 100,
          destinationType: this.camera.DestinationType.DATA_URL,
          sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE,
          targetWidth: 200,
          targetHeight: 200,
          allowEdit: true,
        };
      }
      if (!isRadio) {
        delete cameraOption.targetHeight;
        delete cameraOption.targetWidth;
      }
      this.camera.getPicture(cameraOption).then((imageData) => {
        resolve(imageData);
      }, (err) => {
        reject(err);
      });
    });
  }

  makeFilename() {
    const fn = Math.random().toString(36).substring(7) + '.jpg';
    return fn;
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 3000
    });
    return await loading.present();
  }

  hideLoading() {
    this.loadingCtrl.dismiss();
  }

  async presentAlert(h, msg) {
    const alert = await this.alertCtrl.create({
      header: h,
      message: msg,
      buttons: ['OK'],
      cssClass: 'simple-alert',
      mode: 'ios'
    });
    await alert.present();
  }

  async presentWarningAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: 'Warning!',
      message: msg,
      buttons: ['OK'],
      cssClass: 'warning-alert',
      mode: 'ios'
    });
    await alert.present();
  }

  async presentErrorAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: 'Error!',
      message: msg,
      buttons: ['OK'],
      cssClass: 'error-alert',
      mode: 'ios'
    });
    await alert.present();
  }

  async presentAlertWithOptions(msg, btn) {
    return new Promise(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: msg,
        cssClass: 'error-alert',
        mode: 'ios',
        backdropDismiss: false,
        buttons: [{
          text: btn,
          cssClass: 'primary',
          handler: () => {
            resolve(true);
          }
        }]
      });
      await alert.present();
    });
  }

  async presentToast(msg, mode = 'md') {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top',
      mode: mode === 'md' ? 'md' : 'ios',
      cssClass: 'simple-toast'
    });
    toast.present();
  }

  async presentErrorToast(msg, mode = 'md') {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top',
      mode: mode === 'md' ? 'md' : 'ios',
      cssClass: 'error-toast'
    });
    toast.present();
  }

  validInputPattern($event: any, mode) {
    const key = $event.target.value;
    let regex, singleRegex;
    switch (mode) {
      case '1':
        regex = /^\d+$/;
        singleRegex = /^[0-9]$/;
        break;
      case 'a':
        regex = /^[a-zA-Z]+$/;
        singleRegex = /^[A-Za-z]$/;
        break;
      case 'n':
        regex = /^[a-zA-Z ]+$/;
        singleRegex = /^[A-Za-z ]$/;
        break;
      default:
        break;
    }
    if ( !regex.test(key) ) {
      const result = [];
      const data = $event.target.value.split('');
      data.forEach(c => {
        if (singleRegex.test(c)) {
          result.push(c);
        }
      });
      // let result = $event.target.value.match(regex);
      $event.target.value = result ? result.join('')  : '';
    }
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition({timeout: 3000, enableHighAccuracy: false}).then((positon) => {
        resolve({
          lat: positon.coords.latitude,
          lng: positon.coords.longitude
        });
      }).catch((err) => {
        console.warn('getUserPosition', err);
        reject(false);
      });
    });
  }

  generateYearList() {
    const d = new Date();
    const year = d.getFullYear();
    const yearArr = [];
    for (let i = year; i > (year - 60); i--) {
      yearArr.push('' + i);
    }
    return yearArr;
  }

}
