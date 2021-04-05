import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { NavController, MenuController, Platform, PopoverController } from '@ionic/angular';
import { PushService } from '../_services/push.service';
import { DataService } from '../_services/data.service';
import { AdService } from '../_services/ad.service';
import { Ad, Company } from '../company/company.page';
import { MessageService } from '../_services/message.service';
import { LoginMessagesComponent } from '../_shared/login-messages/login-messages.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  pages: any[] = [
    {
      title: 'Home',
      link: '/home/dashboard',
      icon: 'ios-home'
    },
    {
      title: 'Search',
      link: '/home/search',
      icon: 'search'
    },
    {
      title: 'Map',
      link: '/home/nearme',
      icon: 'pin'
    },
    {
      title: 'Profile',
      link: '/profile/view',
      icon: 'person'
    },
    {
      title: 'Messages',
      link: '/home/messages',
      icon: 'mail'
    },
    /* {
      title: 'Privacy Requests',
      link: '/home/privacy-requests',
      icon: 'mail'
    }, */
    {
      title: 'Friends',
      link: '/home/friends',
      icon: 'md-contacts'
    },
    {
      title: 'Bulletin Board',
      link: '/home/bulletinboard',
      icon: 'calendar'
    },
    {
      title: 'Sponsors & Ad Info',
      link: '/company',
      icon: 'business'
    },
    {
      title: 'Leaderboard',
      link: '/home/leaderboard',
      icon: 'speedometer'
    },
    {
      title: 'Invite Code',
      link: '/home/invite-code',
      icon: 'code-working'
    },
    // {
    //   title: 'Twitter Pulse',
    //   link: '/home/tweets',
    //   icon: 'logo-twitter'
    // },
    // {
    //   title: 'Photo Stream',
    //   link: '/home/photo-stream',
    //   icon: 'images'
    // },
    // {
    //   title: 'Invited Users',
    //   link: '/home/invites',
    //   icon: 'md-people'
    // },
    {
      title: 'Support',
      link: '/privacy',
      icon: 'md-help'
    },
    {
      title: 'Log out',
      link: '/auth',
      icon: 'md-log-out'
    }
  ];

  user: any;
  subscription: any;
  ad: Ad;
  sponsor: Company

  constructor(
    private auth: AuthService,
    private nav: NavController,
    private menuCtrl: MenuController,
    private push: PushService,
    private cdRef: ChangeDetectorRef,
    private dataSv: DataService,
    private adServ: AdService,
    public messageService: MessageService,
    private platform: Platform,
    private popoverCtrl: PopoverController
  ) {}

  ngOnInit(): void {
    this.subscription = this.dataSv.userStatusObs.subscribe((u) => {
      console.log('userStatus', u);
      if (u) {
        this.messageService.getUserMessageCount();
        this.user = u.user;
        this.cdRef.detectChanges();
      }
      
    });
    if (!localStorage.device_token) {
      if (this.platform.is('cordova')) {
        this.push.initialize();
        this.push.getIds();
      }
    }
    console.log("History", history)
    if (history.state.login) {
      console.log("History state login")
      switch (history.state.login) {
        case "1":
          // Open first popover
          const header = "Welcome to AlumniMatch!"
          const body = `WOW! You made it through registration, now what? Well, we suggest you first
                        scroll through the Community Pulse page, then click the MENU icon in the top 
                        right to browse through each section of the AlumniMatch app. Be sure to check 
                        out the LEADERBOARD to see your TOP matches and please contribute to the 
                        Bulletin Board. Simple right? Now go forth and jump into your alumni Community!`
          this.openLoginMessage(header, body)
          break;
        case "2":
          // Open 2nd popover
          const header2 = "Welcome Back!"
          const body2 = `We are so excited to see you again! You rock! We hope you have browsed through 
                        all of the AlumniMatch sections, if not, get going please! AlumniMatch is about Community, 
                        and that means you need to get involved! You can post on the Bulletin Board and interact with 
                        alumni in so many ways. Last but not least, help us invite other alumni! You have an invite code 
                        generator and can use this to invite your friends that you know are also alumni.`
          this.openLoginMessage(header2, body2)
          break;
        case "3": 
          // Open 3rd popover
          const header3 = "WOW, you must like AlumniMatch!"
          const body3 = `This is just awesome. You are visiting once again! If you like what we are building at AlumniMatch, 
                        please invite at least one other alumni you know. The more alumni on the app, the more chances amazing 
                        connections and matches will be made between members. It all depends on your help though! 
                        Again, have fun, and spread the good word about AlumniMatch!`
          this.openLoginMessage(header3, body3)
          break;
        default:
          /* console.log("Displaying login message")
          const header4 = "Hello again!"
          const body4 = `We'd like to say hi every time you login to the app to help you feel like you welcome here. We really enjoy 
                        you being a part of the app and hope you can spread it as far as the eye can see!... We'd like to say hi every time you login to the app to help you feel like you welcome here. We really enjoy 
                        you being a part of the app and hope you can spread it as far as the eye can see!.... We'd like to say hi every time you login to the app to help you feel like you welcome here. We really enjoy 
                        you being a part of the app and hope you can spread it as far as the eye can see!`
          this.openLoginMessage(header4, body4) */
          break;
      }
      localStorage.setItem('logins', history.state.login)
    }
  }

  ionViewWillEnter() {
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async openLoginMessage(header: string, body: string) {
    console.log("*****Open Login Message*****")
    const popover = await this.popoverCtrl.create({
      component: LoginMessagesComponent,
      componentProps: {header, body},
      cssClass: 'login-message'
    })
    await popover.present()
  }

  onClickMenu(page) {
    this.menuCtrl.close();
    if (page.title === 'Profile') {
      return;
    }
    if (page.title === 'Log out') {
      this.auth.signout();
    } else {
      this.nav.navigateForward(page.link);
    }
    console.log('page', JSON.stringify(page));
  }

  viewProfile() {
    console.log('view profile');
    this.nav.navigateForward('/profile/view');
  }

  editProfile() {
    console.log('edit profile');
    this.nav.navigateForward('/profile');
    this.menuCtrl.close();
  }

}
