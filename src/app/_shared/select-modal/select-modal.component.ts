import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-modal',
  templateUrl: './select-modal.component.html',
  styleUrls: ['./select-modal.component.scss'],
})
export class SelectModalComponent implements OnInit, OnDestroy {

  title: string;
  multiple: boolean;
  items: any[];
  selectedItem: any | any[];
  constructor(
    navParams: NavParams,
    private modalCtrl: ModalController
  ) {
    this.title = navParams.get('title');
    this.multiple = navParams.get('multiple');
    this.items = navParams.get('items');
    this.selectedItem = navParams.get('selectedItem');
    console.log('items', this.items);
  }

  ngOnInit() {
    if (this.multiple) {
      if (this.selectedItem && this.selectedItem.length > 0) {
        this.items.forEach((item) => {
          const index = this.selectedItem.map(v => v.id).indexOf(item.id);
          item.selected = (index > -1);
        });
      } else {
        this.items.forEach((item) => {
          item.selected = false
        })
      }
    }
  }

  ngOnDestroy() {
    console.log('SelectModalComponent destroyed');
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onSelect() {
    if (this.multiple) {
      const res = this.items.filter(x => x.selected === true);
      this.modalCtrl.dismiss(res);
    } else {
      const res = this.items.find(x => x.id === this.selectedItem);
      this.modalCtrl.dismiss(res);
    }
  }

  getSearchResult(key = '') {
    const result = this.items.filter(x => x.name.toUpperCase().indexOf(key.toUpperCase()) > -1);
    return result;
  }

}
