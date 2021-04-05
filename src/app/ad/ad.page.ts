import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, NavController, PopoverController, ToastController } from '@ionic/angular';
import { Ad, Company } from '../company/company.page';
import { AdService } from '../_services/ad.service';
import { ApiService } from '../_services/api.service';
import { CompanyService } from '../_services/company.service';
import { InterestedInputComponent } from '../_shared/interested-input/interested-input.component';

export interface AdComment {
  user: {
    first_name: string,
    last_name: string,
    id: string,
    avatar: string
  }
  created_at: Date,
  comment: string
}

@Component({
  selector: 'app-ad',
  templateUrl: './ad.page.html',
  styleUrls: ['./ad.page.scss'],
})
export class AdPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent;

  //comments: any[] = [];
  likes: any[] = [];
  comment: AdComment;
  isLiked: boolean;
  leadUsed: boolean;
  isLoading = false;
  isError = false;
  isDisabled = true;
  isFocused = true

  ad: Ad;
  sponsor: Company;
  preview: boolean = false
  addCommentClicked: boolean = false;
  currentUser: {
    id: string;
    avatar: string;
    first_name: string;
    last_name: string;
  };

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private api: ApiService,
    private toastCtrl: ToastController,
    private popoverCtrl: PopoverController,
    private companyServ: CompanyService,
    private adServ: AdService
  ) {
    
    if (history.state.preview) {
      this.preview = history.state.preview
    }

    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.comment = {user: this.currentUser, comment: '', created_at: new Date() };
    console.log(this.currentUser);
  }

  async ngOnInit() {
    if (history.state.ad) {
      this.ad = history.state.ad
    } else {
      const adId = this.route.snapshot.paramMap.get('id');
      this.ad = await this.getAd(adId)
    }

    if (history.state.sponsor) {
      this.sponsor = history.state.sponsor
    } else {
      this.sponsor = await this.getSponsor(this.ad.company_id)
    }

    console.log("Sponsor in ad", this.sponsor)

    this.checkLeadUsed()
  }

  checkLeadUsed() {
    if (this.ad.leadsUsed && this.ad.leadsUsed.likes.find(like => like.user_id === this.currentUser.id)) {
      this.isLiked = true
      this.leadUsed = true
    } 

    if (this.ad.leadsUsed && this.ad.leadsUsed.comments.find((comment) => comment.user.id === this.currentUser.id) ) {
      this.leadUsed = true
    }

    if (this.ad.leadsUsed && this.ad.leadsUsed.viewed_sponsor.find((view) => view.user_id === this.currentUser.id) ) {
      this.leadUsed = true
    }
  }

  async getAd(id: string): Promise<Ad> {
    const allAds = await this.adServ.getAllAds()    
    let ad = allAds.find((ad) => ad.id === Number(id))
    return ad
  }

  async getSponsor(id: number): Promise<Company> {
    //await this.companyServ.getAllCompanies()
    return await this.companyServ.getCompany(id)
  }

  ScrollToBottom() {
    this.content.scrollToBottom(1500);
  }

  _handleMessageInput(e) {
    this.isDisabled = e.target.value.length === 0 ? true : false;
    this.comment = { ...this.comment, [e.target.name]: e.target.value };
  }

  _getAd(adId) {
    this.isLoading = true;
    this.api.post(`ad/${adId}`, { isAuth: true }).subscribe(
      (res: any) => {
        this.ad = { ...res.data };
        this.isLoading = false;
        console.log(res);
      },
      (err) => {
        console.error('get_ad_error', err);
        this.isLoading = false;
        this.isError = err.error.message;
      }
    );
  }

  async commentAd() {
  
    this.ad.leadsUsed.comments.push(this.comment)    

    if (!this.leadUsed) {
      this.leadUsed = true
      this.ad.leadsRemaining--
    }
    this.updateAd()
  }

  async interested() {
    const popover = await this.popoverCtrl.create({
      component: InterestedInputComponent,
    })

    await popover.present()

    await popover.onWillDismiss().then((res) => {
      if (res.data) {
        const email = res.data.email
        const additionalInfo = res.data.additionalInfo
        let message = email ? `${email} - Thanks! We will let the ad creator know your email address. The ad creator should contact you soon!` : 'Thanks! We will let the ad creator know you are interested. The ad creator should contact you soon!'
        message += additionalInfo ? ` - Additional Info: ${additionalInfo}` : ''
        this.presentToast(message)
        if (!this.isLiked) {
          this.ad.leadsUsed.likes.push({user_id: this.currentUser.id, user_email: email, message: additionalInfo, created_at: new Date()})
          
          this.isLiked = true

          if (!this.leadUsed) {
            this.leadUsed = true
            this.ad.leadsRemaining--
          }
        
          this.updateAd()
        }
      } else {
        if (!this.isLiked) {
          this.ad.leadsUsed.likes.push({user_id: this.currentUser.id, created_at: new Date()})

          this.isLiked = true

          if (!this.leadUsed) {
            this.leadUsed = true
            this.ad.leadsRemaining--
          }
        
          this.updateAd()
        }
      }

    })
    console.log(`interested clicked`)
    // store in ad data
  }

  updateAd() {
    if (this.ad.leadsRemaining === 0) {
      this.ad.active = false
    }
    console.log(this.ad)
    this.api.put(`ads/${this.ad.id}`, this.ad).subscribe((res: any) => {
      console.log("updated ad!", res)
    }, (err) => {
      console.error("Error updating ad", err)
    })
  }

  addComment() {
    console.log(`addComment clicked`)
    this.addCommentClicked = true;
  }
  
  viewSponsor() {
    console.log("View Sponsor", this.sponsor)
    if (!this.preview) {
      if (!this.ad.leadsUsed.viewed_sponsor.find((view) => view.user_id === this.currentUser.id)) {
        this.ad.leadsUsed.viewed_sponsor.push({user_id: this.currentUser.id, created_at: new Date()})
        if (!this.leadUsed) {
          this.leadUsed = true
          this.ad.leadsRemaining--
        }   
        this.updateAd()
      }
  
      this.navCtrl.navigateForward('/sponsor/' + this.ad.company_id)
      //console.log(`viewCompany clicked - ${this.sponsor}`)
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      showCloseButton: true,
      position: "middle",
      duration: 5000
    })

    await toast.present()
  }

  back() {
    history.back()
  }

}
