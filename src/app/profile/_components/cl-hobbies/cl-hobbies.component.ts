import { Component, OnInit, ComponentRef } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';
import { ModalController } from '@ionic/angular';
import { SelectModalComponent } from 'src/app/_shared/select-modal/select-modal.component';
import { HOBBIES } from 'src/app/_config/hobbies.constant';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-cl-hobbies',
  templateUrl: './cl-hobbies.component.html',
  styleUrls: ['./cl-hobbies.component.scss'],
})
export class ClHobbiesComponent implements OnInit {

  data: any[] = [];
  all_hobbies = HOBBIES;
  constructor(
    private api: ApiService,
    private modalCtrl: ModalController,
    private dataServ: DataService
  ) { }

  ngOnInit() {
    this.getHobbies();
  }

  getHobbies() {
    this.api.get('user/hobbies', true).subscribe((res) => {
      console.log('user/hobbies', JSON.stringify(res));
      this.data = res;
    }, (err) => {
      console.error('Error: user/hobbies', err);
    });

    this.api.get('static/hobbies').subscribe((res) => {
      console.log('static/hobbies', res)
    }, (err) => {
      console.error('Error: static/hobbies', err);
    })
  }

  onSubmit() {
    if (this.validateData()) {
      this.api.post('user/hobbies', this.data, true).subscribe((res) => {
        console.log('user/hobbies', res);
        this.modalCtrl.dismiss({success: true});
        this.dataServ.updateUserData({cl: {hobbies: this.data}})
      }, (err) => {
        console.error('Error: user/hobbies', err);
        alert("An error has occurred and we could not save your hobbies. Please try again.")
      });
    }
  }

  validateData() {
    if (this.data.length === 0) {
      alert("Please select at least one hobby.")
      return false
    }

    return true
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  removeHobby(index: number) {
    console.log(this.data, index)
    this.data.splice(index, 1)
  }

  async selectHobby() {
    let hobbies = []

    if (this.data) {
      for (let pieceOfData of this.data) {
        hobbies.push(pieceOfData.hobby)
      }
    }

    console.log(`Hobby's data: ${JSON.stringify(this.data[0])} - Hobby Id's: ${JSON.stringify(hobbies)}`)

    const modal = await this.modalCtrl.create({
      component: SelectModalComponent,
      componentProps: {
        items: this.all_hobbies,
        selectedItem: hobbies.length > 0 ? hobbies : null,
        multiple: true,
        title: 'Select hobby',
      },
      cssClass: 'select-modal-css',
      backdropDismiss: false
    });
    modal.onDidDismiss().then((res: {data: any[]}) => {
      console.log('chooseHobby', res);
      if (res.data) {
        if (hobbies.length > 0) {
          for (const hobby of res.data) {
            if (!this.data.find(pieceOfData => pieceOfData.hobby.id === hobby.id)) {
              //delete hobby.selected;
              this.data.push({hobby: hobby, skill_scale: 0, match_scale: 0, teach_scale: 0})
            }
          }

          this.data = this.data.filter(pieceOfData => res.data.findIndex(hobby => hobby.id === pieceOfData.hobby.id) !== -1)
        } else {
          for (const hobby of res.data) {
            //delete hobby.selected;
            this.data.push({hobby: hobby, skill_scale: 0, match_scale: 0, teach_scale: 0})
          }
          //this.data = res.data
          console.log(`Hobbies length is 0`)
        }
        console.log(this.data)
        /* this.data.forEach((hobby) => {
          delete hobby.hobby.selected
        })
        console.log(this.data) */

      } else {
        console.log(`Cancelled the selection`)
      }
    }).catch((err) => {
      console.error('chooseHobby', err);
    });
    return await modal.present();
  }

}
