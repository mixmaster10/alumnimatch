import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { SelectModalComponent } from 'src/app/_shared/select-modal/select-modal.component';
import { AuthService } from 'src/app/_services/auth.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { PickLocationModalComponent } from 'src/app/_shared/pick-location-modal/pick-location-modal.component';
import { NamesComponent } from 'src/app/auth/_components/names/names.component';
import { Router } from '@angular/router';
import { MoreInfoComponent } from 'src/app/_shared/more-info/more-info.component';

export interface College {
  acronym: string;
  banner: string;
  color1: string;
  color2: string;
  id: number;
  logo1: string;
  logo2: string;
  name: string;
  slogan: string;
}

@Component({
  selector: 'app-ps-colleges',
  templateUrl: './ps-colleges.component.html',
  styleUrls: ['./ps-colleges.component.scss'],
})
export class PsCollegesComponent implements OnInit {

  data: College[] = [];

  flag: boolean = false;

  countries: any[];
  states: any[];
  colleges: any[];

  selectCountryOption: any = {
    header: 'Choose Country',
    mode: 'md',
    cssClass: 'am-select-popup'
  };
  selectStateOption: any = {
    header: 'Choose State',
    mode: 'md',
    cssClass: 'am-select-popup'
  };

  collegeForm: FormGroup;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private cdRef: ChangeDetectorRef,
    private nav: NavController,
    private auth: AuthService,
    private utils: UtilsService,
    private router: Router
  ) {
    this.initCollegeForm();
  }

  ngOnInit() {
    this.getCollegeData();
    this.getCountriesWithOUCollege();
  }

  initCollegeForm() {
    this.collegeForm = this.formBuilder.group({
      country: new FormControl(1, [Validators.required]),
      state: new FormControl(36, [Validators.required]),
      college: new FormControl({id: 1489, name: 'University of Oklahoma'}, [Validators.required])
    });
  }

  getCollegeData() {
    this.api.get('user/college', true).subscribe((res: any) =>{
        console.log('got Colleges', res);
        var i;
        this.data[0] = res.primary;
        
        Object.keys(res).forEach(key => {
          this.data[key] = res[key];
        });
          
    }, (err) => {
      console.error('getCollege Error', err);
    }); 

  }

  toggleCollege(){
    this.flag = !this.flag;
  }

  addCollege(){
    var i;
    var flag = false;
    if(!this.data[0].name){
      this.data[0] = this.collegeForm.controls.college.value
    }
    else{
      //if (this.data.findIndex((college) => college))
      for(i = 0; i < this.data.length; i++){
        if(this.data[i].id === this.collegeForm.controls.college.value.id)
          flag = true;
      }
      if(!flag)
        this.data.push(this.collegeForm.controls.college.value);
        this.flag = false;
    }
  }

  onSubmit(){
    var body = {}
    var data = {"primary": this.data[0].id };
    var i;

    for(i = 1; i < this.data.length; i++){
      data[""+i] = this.data[i].id
    }

    body["college"] = data;
    console.log(body);

    this.api.post('user/college',body).subscribe((res: any) => {
      console.log('send colleges success', res);
      this.dismiss();
    }, (err) =>{
      console.error("send colleges error", err);
    });
  }

  setFormListener() {
    this.collegeForm.get('country').valueChanges
      .subscribe(selectedCountry => {
        if (!selectedCountry) {
          this.collegeForm.controls.state.reset();
          this.collegeForm.controls.college.reset();
        } else {
          this.getStates(selectedCountry);
          this.collegeForm.controls.state.reset();
          this.collegeForm.controls.college.reset();
        }
        this.cdRef.detectChanges();
      });
    this.collegeForm.get('state').valueChanges
      .subscribe(selectedState => {
        console.log('selectedState', selectedState);
        if (!selectedState) {
          this.collegeForm.controls.college.reset();
        } else {
          this.getColleges(selectedState);
          this.collegeForm.controls.college.reset();
        }
        this.cdRef.detectChanges();
      });
  }

  getCountriesWithOUCollege() {
    this.api.get('static/countries/ou', true).subscribe((res: any) => {
      console.log('countries', res);
      this.countries = res.countries;
      this.states = res.states;
      this.colleges = res.colleges;

      /* this.collegeForm.patchValue({
        country: 1,
        state: 36,
        college: {id: 1489, name: 'University of Oklahoma'}
      }); */
      this.setFormListener();
      this.cdRef.detectChanges();
    });
  }

  getColleges(sid) {
    const cid = this.collegeForm.value.country;
    this.api.get(`static/colleges/filter?country=${cid}&state=${sid}`, true).subscribe((res: any[]) => {
      this.colleges = res;
    });
  }

  getStates(cid) {
    this.api.get(`static/states/filter?country=${cid}`, true).subscribe((res: any[]) => {
      this.states = res;
      console.log('states', this.states);
    });
  }

  async moreInfoPopup() {
    return await new Promise(async (resolve, reject) => {
      const modal = await this.modalCtrl.create({
        component: MoreInfoComponent,
        backdropDismiss: false
      })
      modal.onDidDismiss().then((res) => {
        if (res && res.data) {
          console.log('Res', res.data)
          resolve(res.data)
        } else {
          reject()
        }
      })
      modal.present();

    })
  }
  async chooseCollege() {
    console.log('choose college', this.colleges);
    const selectedItem = this.collegeForm.controls.college.value;
    const modal = await this.modalCtrl.create({
      component: SelectModalComponent,
      componentProps: {
        items: this.colleges,
        selectedItem: selectedItem ? selectedItem.id : null,
        multiple: false,
        title: 'Select College'
      },
      cssClass: 'select-modal-css',
      backdropDismiss: false
    });
    modal.onDidDismiss().then((res) => {
      console.log('chooseCollege', res);
      if (res.data) {
        this.collegeForm.controls.college.setValue(res.data);
      }
    }).catch((err) => {
      console.error('chooseCollege', err);
    });
    return await modal.present();
  }

  showNoCollegeAlert() {
    const message = `please visit our contact us page and write us a note saying your school is not in the alumnimatch database.
                     We apologize! We will alert you when your school is added!`;
    this.utils.presentAlert('No College', message);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
