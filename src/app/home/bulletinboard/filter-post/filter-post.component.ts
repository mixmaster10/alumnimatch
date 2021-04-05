import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { type } from 'os';
import { College } from 'src/app/profile/_components/ps-colleges/ps-colleges.component';
import { ApiService } from 'src/app/_services/api.service';
import { DataService } from 'src/app/_services/data.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { SelectModalComponent } from 'src/app/_shared/select-modal/select-modal.component';

interface PostTypeCategory {
  id: number
  name: string
  shortDescription: string
  icon: string
  selected?: boolean
}

@Component({
  selector: 'app-filter-post',
  templateUrl: './filter-post.component.html',
  styleUrls: ['./filter-post.component.scss'],
})
export class FilterPostComponent implements OnInit {
  titles: any[] = ['Filters', 'Choose Post Type', 'Choose Post Type Category', ['Choose Networks']];
  title: string;
  step: number = 0;
  posts: any[] = [];
  postTypes: PostTypeCategory[] = [];
  postTypesCategory: PostTypeCategory[] = [];
  networks: {college: any, selected: boolean}[] = []

  filter: {postTypeIds: number[], postCategoryIds: number[], networkIds: number[]} = {
    postTypeIds: [],
    postCategoryIds: [],
    networkIds: []
  };
  typecounter = 0;
  catcounter = 0;
  isLoading = true;
  isError: string;
  isLast = false;
  JSON: any;

  constructor(
    public viewCtrl: ModalController, 
    private utils: UtilsService, 
    public toastController: ToastController, 
    private api: ApiService,
    private dataServ: DataService,
    private modalCtrl: ModalController
  ){
    this.step = 0;
  }

  ngOnInit() {
    this._changeTitle();
    this.getPostCategory();
    this.getCollegeData();
    /* if (this.dataServ.userInfo.user.college.length > 0) {
      this.networks = [{college: this.dataServ.userInfo.user.college, selected: false}]//.map((college) => {return {college: college, selected: false}})
    }  */
  }

  dismiss() {
    this.viewCtrl.dismiss(this.posts);
    //this.posts = []
  }

  async presentToast(success) {
    var toast;
    success ? toast = await this.toastController.create({
      message: 'Filter Success',
      color: 'success',
      duration: 2000,
      position: 'middle',
    }) :
     toast = await this.toastController.create({
       message: 'No Posts Found',
       color: 'error',
       duration: 2000,
       position: 'middle',

     });
    toast.present();
  }

  _handleSelection(e) {
    console.log(e)
    let value = e.target.value;
    if (this.step === 1) {
      this.postTypes[value - 1].selected = !this.postTypes[value - 1].selected
      if (e.target.checked) {
        this.filter.postTypeIds[this.typecounter] = value
        this.typecounter++
      } else {
        this.typecounter--
        this.filter.postTypeIds.splice(this.typecounter)
      }
    } else if (this.step === 2) {
      if (e.target.checked) {
        this.filter.postCategoryIds[this.catcounter] = value;
        this.catcounter++;
      } else {
        this.catcounter--;
        this.filter.postCategoryIds.splice(this.catcounter);
      }
    } else if (this.step === 3) {
      const index = this.networks.findIndex((network) => network.college.id == value)
      console.log(this.networks, index, value)
      this.networks[index].selected = !this.networks[index].selected
      e.target.checked ? this.filter.networkIds.push(value) : this.filter.networkIds.splice(this.filter.networkIds.findIndex(value))
    }
    
    console.log(this.filter);
  }

  chooseFilter(filter: string) {
    switch (filter) {
      case 'type':
        this._handleNext();
        break;
      case 'network':
        this.chooseNetworks();
        break;
      default:
        console.log('Default filter type')
    }
  }

  async chooseNetworks() {
    this.step = 3
    this._changeTitle()
  }

  moreFilters() {
    this.step = 0
    this._changeTitle()
    console.log(this.networks, this.filter, this.postTypes, this.postTypesCategory)
  }

  _handleNext() {
    
    let nextStep = this.step + 1;
    if(nextStep > 3){
      return; // do nothing
    }
    this.step = nextStep;  
    this._changeTitle();
    if (nextStep === 2 || this.postTypes.length < 1) {
      this.getPostCategory();
    }
  }

  _handlePrev() {
    if (this.step === 3) {
      this.step = 0
    } else {
      let nextStep = this.step - 1;
      if(this.step === 2){
        //this.filter.postCategoryIds = [];
        //this.filter.postTypeIds = [];
        this.catcounter = 0;
        this.typecounter = 0;
      } 
      this.step = nextStep;
    }
    
    this._changeTitle();
  }

  _handleFilter(){
    console.log("Filtering...");
    
    if (this.filter.postCategoryIds.length > 0) {
      let url = `post/categories`
      this.api.post(url, {postCategoryIds: this.filter.postCategoryIds, postTypeIds: this.filter.postTypeIds}).subscribe(
        (res: any) => {
          this.posts = res.data;
          if (this.filter.networkIds.length === 0) {
            this.isLoading = false;
            console.log(res);
            this.posts === undefined ? this.presentToast(false) : this.presentToast(true);
            console.log(this.posts);
            this.dismiss();
          }
          
        },
        ({ error }) => {
          console.error('getpostdataError', error);
          this.isLoading = false;
          this.isError = error.message;
          this.presentToast(false);
        }
      );
    }
    

    this.filter.networkIds.forEach((id, index) => {
      this.api.post(`post/getPostsByCollege/${id}`, {collegeId: id}).subscribe((res: any) => {
        this.posts.push(res.data)
        if (index === this.filter.networkIds.length - 1) {
          this.isLoading = false
          this.posts === undefined ? this.presentToast(false) : this.presentToast(true);
          this.dismiss();

        }
      }, (error) => {
        console.error('getpostdataError', error);
        this.isLoading = false;
        if (this.posts === undefined || this.posts.length < 1 ) {
          this.isError = error.error.message;
          this.presentToast(false);
          this.step = 0
        } else {
          this.presentToast(true)
          this.dismiss()
        }
        
      })
    })
    
  }
  

  getPostCategory() {
    this.isLoading = true;
    if (this.step === 1) {
      let url = 'post/types';

      this.api.get(url).subscribe(
        (res: any) => {
          this.postTypes = (res.data as PostTypeCategory[]).map((type) => {
            return {...type, selected: false} 
          });
          this.isLoading = false;
          console.log(res);
          
        },
        ({ error }) => {
          console.error('getpostdataError', error);
          this.isLoading = false;
          this.isError = error.message;
          
        }
      );
    }
    else if (this.step === 2) {
      this.filter.postTypeIds.forEach(e => {
        let url = `post/type-categories/${e}`;

        this.api.get(url).subscribe(
          (res: any) => {
            this.filter.postCategoryIds = [];
            this.postTypesCategory.length === 1 ? this.postTypesCategory = res.data : this.postTypesCategory = this.postTypesCategory.concat(res.data);
            this.isLoading = false;
            console.log(res);
            console.log(this.postTypesCategory);
          },
          ({ error }) => {
            console.error('getpostdataError', error);
            this.isLoading = false;
            this.isError = error.message;
          }
        );
      });
      
    } else {
      this.isLoading = false
    }
    
  }
  _changeTitle() {
    this.isLast = this.step === 2 ? true : false;
    this.title = this.titles[this.step];
    console.log(this.title);
  }

  getCollegeData() {
    this.api.get('user/college', true).subscribe((res: any) =>{
        console.log('got Colleges', res);
        
        Object.keys(res).forEach((key, index) => {
          this.networks[index] = {college: res[key], selected: false};
        });
          
    }, (err) => {
      console.error('getCollege Error', err);
    }); 

  }
}
