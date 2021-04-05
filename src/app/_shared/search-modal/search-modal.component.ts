import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/_services/api.service';
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
})
export class SearchModalComponent implements OnInit, OnDestroy {
  
  items: any[];
  title: string;
  multiple: boolean;
  url: string;
  selectedItem: any | any[];
  filteredItems: any[];
  constructor(
    navParams: NavParams,
    private apiService: ApiService,
    private utils: UtilsService,
    private modalCtrl: ModalController
  ) {
    this.title = navParams.get('title');
    this.multiple = navParams.get('multiple');
    this.url = navParams.get('url');
    this.selectedItem = navParams.get('selectedItem');
    this.items = navParams.get('items')
    console.log(this.selectedItem)
    this.filteredItems = this.items
  }

  ngOnInit() {
    if (this.multiple) {
      if (this.selectedItem && this.selectedItem.length > 0) {
        this.filteredItems.forEach((item) => {
          const index = this.selectedItem.map(v => v.id).indexOf(item.id);
          item.selected = (index > -1);
        });
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
      const res = this.filteredItems.filter(x => x.selected === true);
      this.modalCtrl.dismiss(res);
    } else {
      const res = this.filteredItems.find(x => x === this.selectedItem);
      this.modalCtrl.dismiss(res);
    }
  }

  getSearchResult(value = '') {
      if (!value.trim()) {
        this.filteredItems = this.items
        return false;
      }

      console.log(value);

      if (this.url.includes("mos-by-code") ) {
        this.filteredItems = this.items.filter((item: string) => item.includes(value))
      } else {
        const t = this.apiService.get(this.url.replace('__search', value))
        .subscribe((res: any) => {
          this.filteredItems = res.data;
          t.unsubscribe();
          return this.filteredItems;
        }, (err) => {
          this.utils.presentErrorAlert(err.error.message);
        });
      }
      
  }
}
