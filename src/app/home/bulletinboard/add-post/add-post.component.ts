import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/_services/api.service';
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
})
export class AddPostComponent implements OnInit {
  titles: any[] = ['Choose Post Type', 'Choose Post Type Category', 'Post Information', 'Post Creating'];
  title: string;
  step: number = 1;
  postTypes: any[] = [];
  postTypesCategory: any[] = [];
  isLast: boolean = false;
  isSubmitting: boolean = false;
  post: any = {
    postTypeId: 0,
    postCategoryId: 0,
  };

  isLoading = true;
  isError = false;
  errorMessage;
  JSON: any;
  imageFlag = true;
  constructor(public viewCtrl: ModalController, private utils: UtilsService, public toastController: ToastController, private api: ApiService) {
    this.step = 1;
  }

  ngOnInit() {
    this._changeTitle();
    this.getPostCategory();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  takePhoto() {
    this.utils
      .takePhoto(true)
      .then((imageData) => {
        this.post.photoUrl = 'data:image/jpeg;base64,' + imageData;
      })
      .catch((err) => {
        console.error('err', err);
      });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Post Published Successfully.',
      color: 'success',
      duration: 2000,
      position: 'middle',
    });
    toast.present();
  }

  _handleSelection(e) {
    let value = e.detail.value;
    let type = this.step === 1 ? 'postTypeId' : 'postCategoryId';
    this.post = { ...this.post, [type]: value };
  }

  _handleInputChange(e: any) {
    let value = e.target.value;
    let name = e.target.name;
    this.post = { ...this.post, [name]: value };
  }

  _handleNext() {
    
    let nextStep = this.step + 1;
    if(nextStep > 3){
      return; // do nothing
    }
    this.step = nextStep;  
    this._changeTitle();
    if (nextStep === 2) {
      this.getPostCategory();
    }
  }

  _handlePrev() {
    let nextStep = this.step - 1;
    this.step = nextStep;
    this._changeTitle();
    // if (nextStep === 1) {
    //   this.getPostCategory();
    // }
  }

  getPostCategory() {
    this.isLoading = true;
    let url = this.step === 2 ? `post/type-categories/${this.post.postTypeId}` : 'post/types';

    this.api.get(url).subscribe(
      (res: any) => {
        if (this.step === 2) this.postTypesCategory = res.data;
        if (this.step === 1) this.postTypes = res.data;
        this.isLoading = false;
      },
      ({ error }) => {
        console.error('getpostdataError', error);
        this.isLoading = false;
        this.isError = error.message;
        this.errorMessage = JSON.stringify(error.message)
      }
    );
  }

  _handlePublish() {
    this.isSubmitting = true;
    let postData = { ...this.post };
    this.api.post('post/create-or-update', postData).subscribe(
      (res: any) => {
        console.log(res);
        this.dismiss();
        this.presentToast();
        this.isSubmitting = false;
      },
      ({ error }) => {
        console.error('getpostdataError', error);
        this.isSubmitting = false;
        this.isError = error.message;
        this.errorMessage = JSON.stringify(error.message)
      }
    );
  }

  _changeTitle() {
    this.isLast = this.step === 3 ? true : false;
    this.title = this.titles[this.step - 1];
    console.log(this.title);
  }

  failure(image){
    this.imageFlag = false;
    image.src = "/assets/imgs/no-image.png";
    console.log("Invalid Link");
  }
  success(){
    console.log("Image success")
    this.imageFlag = true;
  }

  checkImage() {
    let photoUrl = document.getElementById("photoUrl") as HTMLInputElement;
    if(photoUrl.value === ''){
      console.log("image is blank, submitting as textpost.");
      return true;
    }
    if(this.imageFlag){
      console.log("image is complete "+ this.imageFlag);
      return true;
    }
    console.log("image is invalid " + this.imageFlag);
    return false;
  }

  isValid(){
    var flag = true;
    let title = document.getElementById("title") as HTMLInputElement;
    let description = document.getElementById("description") as HTMLInputElement;
    //let summary = document.getElementById("summary") as HTMLInputElement;

    if (title.value === '') {
      document.getElementsByClassName("required")[0].classList.remove("hidden");
      flag = false;
    }
    else{
      document.getElementsByClassName("required")[0].classList.add("hidden");
    }
    if (description.value === '') {
      document.getElementsByClassName("required")[1].classList.remove("hidden");
      flag = false;
    }
    else{
      document.getElementsByClassName("required")[1].classList.add("hidden");
    }
    /* if (summary.value === ''){
      
      document.getElementsByClassName("required")[2].classList.remove("hidden");
      flag = false;
    }
    else{
      document.getElementsByClassName("required")[2].classList.add("hidden");
    } */
    console.log("submitting...");
    return flag;
    
  }


}
