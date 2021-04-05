import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { TwitterConnect } from '@ionic-native/twitter-connect/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Zoom } from '@ionic-native/zoom/ngx';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx'
import { SignInWithApple } from '@ionic-native/sign-in-with-apple/ngx';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppVersion } from '@ionic-native/app-version/ngx'

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,NgxLinkifyjsModule.forRoot(), 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    StatusBar, 
    SplashScreen, 
    SignInWithApple, 
    InAppBrowser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    Geolocation, 
    Camera, 
    TwitterConnect, 
    GooglePlus, 
    Facebook,
    OneSignal, 
    Zoom,
    AppVersion
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
