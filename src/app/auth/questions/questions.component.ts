import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/_services/utils.service';
import { PickLocationModalComponent } from 'src/app/_shared/pick-location-modal/pick-location-modal.component';
import * as ClConstants from 'src/app/_config/current-life.constant';
import { ApiService } from 'src/app/_services/api.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { SearchModalComponent } from 'src/app/_shared/search-modal/search-modal.component';
import { SelectModalComponent } from 'src/app/_shared/select-modal/select-modal.component';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnInit {
  @Output() questions: EventEmitter<any> = new EventEmitter();
  @Input() data: any;
  miltery: any[];
  sub = new Subscription();
  form: FormGroup;
  public constants = ClConstants;
  constructor(
    private readonly fb: FormBuilder,
    private modalCtrl: ModalController,
    private utils: UtilsService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      parents_from_alma: [this.data ? this.data.parents_from_alma : 0],
      siblings_from_alma: [this.data ? this.data.siblings_from_alma : 0],
      play_video_games: [this.data ? this.data.play_video_games : 0],
      video_games_frequency: [this.data ? this.data.video_games_frequency : ''],
      video_games_categories: [this.data ? this.data.video_games_categories : ''],
      video_games_fav_title: [this.data ? this.data.video_games_fav_title : []],
      athletic_stuff_you_play: [this.data ? this.data.athletic_stuff_you_play : []],
      have_exotic_pet: [this.data ? this.data.have_exotic_pet : 0],
      pet: [this.data ? this.data.pet : ''],
      fan_of_alma_football: [this.data ? this.data.fan_of_alma_football : 0],
      fan_of_alma_basketball: [this.data ? this.data.fan_of_alma_basketball : 0],
      in_us_military: [this.data ? this.data.in_us_military : 0],
      military_type: [this.data ? this.data.military_type : ''],
      military_code: [this.data ? this.data.military_code : ''],
      military_rank: [this.data ? this.data.military_rank : ''],
      dependent_us_military_person: [this.data ? this.data.dependent_us_military_person : 0],
      instrument: [this.data ? this.data.instrument : 0],
      long_have_lived_here: [this.data ? this.data.long_have_lived_here : 0],
      country_to_travel : [this.data ? this.data.country_to_travel : '', Validators.required],
      state_to_travel : [this.data ? this.data.state_to_travel : '', Validators.required],
      city_to_travel : [this.data ? this.data.city_to_travel : '', Validators.required],
    });
  }

  updateCode(code) {
    this.form.controls.military_code.setValue(this.miltery.filter((e) => e.id === code.target.value)[0].code);
  }

  async openSearchModel() {
    const modal = await this.modalCtrl.create({
      component: SearchModalComponent,
      componentProps: {
        url: `auth/get-mos-by-code/__search/${this.constants.MILITARY_TYPE[this.form.value.military_type]}`,
        selectedItem: this.data ? this.data.military_code : null,
        multiple: false,
        title: 'Select Code',
      },
      backdropDismiss: false,
    });
    modal.present();
    modal.onWillDismiss().then((res:any) => {
      this.form.controls.military_code.setValue(res.data.code);
    });
  }

  openSelect(type){
    switch(type){
      case 'games':
        this.gamesModel();
        break;
      case 'sports':
        this.sportsModel();
        break;
    }
  }

  remove_game(index) {
    this.form.value.video_games_fav_title.splice(index, 1);
    this.form.controls.video_games_fav_title.setValue(this.form.value.video_games_fav_title);
  }
  remove_sport(index) {
    this.form.value.athletic_stuff_you_play.splice(index, 1);
    this.form.controls.athletic_stuff_you_play.setValue(this.form.value.athletic_stuff_you_play);
  }
  async gamesModel() {
    const modal = await this.modalCtrl.create({
      component: SelectModalComponent,
      componentProps: {
        items: this.constants.GAME_TITLE.map((e, i) => {
          return {
            name: e,
            id: i
          }
        }),
        selectedItem: this.form.value.video_games_fav_title ? this.form.value.video_games_fav_title.map(e=>{
          return {
            name:this.constants.GAME_TITLE[e],
            id:parseInt(e)
          }
        }) : null,
        multiple: true,
        title: 'Select Game Titles',
      },
      backdropDismiss: false,
    });
    modal.present();
    modal.onWillDismiss().then((res:any) => {
      if(!res.data){
        return false;
      }
      this.form.controls.video_games_fav_title.setValue(res.data.map(e=>e.id));
    });
  }
  async sportsModel(){
    const modal = await this.modalCtrl.create({
      component: SelectModalComponent,
      componentProps: {
        items: this.constants.SPORTS.map((e,i) => {
          return {
            name: e,
            id: i
          }
        }),
        selectedItem: this.form.value.athletic_stuff_you_play ? this.form.value.athletic_stuff_you_play.map(e=>{
          return {
            name:this.constants.SPORTS[e],
            id:parseInt(e)
          }
        }) : null,
        multiple: true,
        title: 'Select Sports Titles',
      },
      backdropDismiss: false,
    });
    modal.present();
    modal.onWillDismiss().then((res:any) => {
      if(!res.data){
        return false;
      }
      this.form.controls.athletic_stuff_you_play.setValue(res.data.map(e=>e.id));
    });
  }
  async getLocation() {
    const modal = await this.modalCtrl.create({
      component: PickLocationModalComponent,
      backdropDismiss: false
    });
    modal.onDidDismiss().then((result) => {
      if (result && result.data) {
        this.form.controls.country_to_travel.setValue(result.data.country);
        this.form.controls.state_to_travel.setValue(result.data.state);
        this.form.controls.city_to_travel.setValue(result.data.city);
      } else {
        this.utils.presentErrorAlert('Please select your location');
      }
    });
    modal.present();
  }
  onSubmit() {
    Object.keys(this.form.controls).forEach(key => {

      const controlErrors = this.form.get(key).errors;
      if (controlErrors != null) {
            Object.keys(controlErrors).forEach(keyError => {
              console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
            });
          }
        });
    console.log(this.form.valid,this.form.value)
    if (this.form.valid) {
      this.questions.emit(this.form.value);
    }
  }
  dismiss() {
    this.modalCtrl.dismiss();
  }

}
