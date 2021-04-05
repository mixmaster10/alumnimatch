import { Component, OnDestroy, OnInit } from '@angular/core';

import { Platform, AlertController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { PushService } from './_services/push.service';
import { Zoom } from '@ionic-native/zoom/ngx';
import { API_KEY, API_SECRET } from 'src/app/_config/zoom.config';
import { DataService } from './_services/data.service';
import { Subscription } from 'rxjs';
import { ApiService } from './_services/api.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { UtilsService } from './_services/utils.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  deferredPrompt;
  dismissed = false;
  subscriptions: Subscription[] = []
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private push: PushService,
    private zoomService: Zoom,
    private alertCtrl: AlertController,
    private dataSv: DataService,
    private api: ApiService,
    private google: GooglePlus,
    private navCtrl: NavController,
    private utils: UtilsService,
    private appVer: AppVersion,
    private iab: InAppBrowser
  ) {
    this.initializeApp();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe()
    })
  }

  ngOnInit(): void {
    console.log(localStorage.getItem('token'))
    this.setUserData()
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {

        this.statusBar.styleDefault();
        if (this.platform.is('android')) {
          this.statusBar.overlaysWebView(false);
          this.statusBar.backgroundColorByHexString('#000000');
        }

        
        this.splashScreen.hide();

        // intialize zoom
        this.zoomService.initialize(API_KEY, API_SECRET)
        .then((success: any) => console.log(success))
        .catch((error: any) => console.log(error));

        this.checkForUpdate()
        
      } else {
        this.triggerAddHome();
      }
    });
  }

  checkForUpdate() {
    console.log("Checking for version")
    this.appVer.getVersionNumber().then((ver) => {
      console.log("Version: ", ver)
      this.api.post(`latestVersion`, {appVersion: ver}).subscribe((res: any) => {
        console.log("Res: ", JSON.stringify(res))
        if (res && res.update) {
          this.updatePrompt(res.force, res.appVersion)
        }
      }, (err) => {
        console.error("Error getting latest version: ", JSON.stringify(err))
      })
      //alert(`App Version: ${ver}`)
    })
  }

  async updatePrompt(force: boolean, version: string) {
    let buttons: {text: string, handler?: () => void, role?: string}[] = [{
      text: 'Update',
      handler: () => {
        console.log("Going to the store")
        //if (this.deferredPrompt) {
          //this.deferredPrompt.prompt();
          // Wait for the user to respond to the prompt
        if (this.platform.is('ios')) {
          this.openBrowser("https://apps.apple.com/in/app/alumnimatch-for-college-alumni/id1440961396")
        } else if (this.platform.is('android')) {
          this.openBrowser('https://play.google.com/store/apps/details?id=com.alumni.app&hl=en_US&gl=US')
        } else {
          alert("Unknown Device. Please contact us.")
        }
         
      }
      //}
    }]
    if (!force) {
      buttons.push({
        text: "Cancel",
        role: "cancel"
      })
    }
    console.log("Displaying update prompt")
    const alertPopup = await this.alertCtrl.create({
      header: "Update Available!",
      message: "Please update the app to continue having a great user experience." + " Version " + version,
      backdropDismiss: false,
      buttons: buttons
    });

    await alertPopup.present()
  }

  openBrowser(link: string) {
    const browser = this.iab.create(link, '_system'); //"enableViewportScale=true"
    browser.show()
  }

  setUserData() {
    const sub1 = this.api.get('user').subscribe((res: any) => {
      console.log('getUserData', res);
      if (res) {
        this.dataSv.initUserData(res)
      }
    }, (err) => {
      console.error('user', err);
    });

    this.subscriptions.push(sub1)
  }

  async triggerAddHome() {
    if (!this.platform.is('mobileweb')) {
      return;
    }
    
    const alertPopup = await this.alertCtrl.create({
      header: "AlumniMatch",
      message: "Please install the app for a better user experience.",
      backdropDismiss: false,
      buttons: [{
        text: 'Install',
        handler: () => {
          //if (this.deferredPrompt) {
            //this.deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            if (this.platform.is('ios')) {
              window.open("https://apps.apple.com/in/app/alumnimatch-for-college-alumni/id1440961396")
              
            } else if (this.platform.is('android')) {
              window.open('https://play.google.com/store/apps/details?id=com.alumni.app&hl=en_US&gl=US')
            } else {
              alert("Unknown Device. Please contact us.")
            }
           
        }
        //}
      }, {
        text: "Cancel",
        role: "cancel"
      }]
    });

    alertPopup.present()

    window.addEventListener('beforeinstallprompt', async (e) => {
      console.log("beforeinstallprompt - addEventListener");
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later on the button event.
      this.deferredPrompt = e;
      // Update UI by showing a button to notify the user they can add to home screen      
      
      if (!this.dismissed)
        await alertPopup.present();
    });

    window.addEventListener('appinstalled', (event) => {
      console.log('app installed');
      this.dismissed = true;
    });
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('display-mode is standalone');
      this.dismissed = true;
    }
    // if (window.navigator.standalone === true) {
    //   console.log('display-mode is standalone');
    //   this.dismissed = true;
    // }
  }
}
