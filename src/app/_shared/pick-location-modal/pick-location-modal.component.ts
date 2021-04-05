import { Component, OnInit } from '@angular/core';
import { ModalController, IonSearchbar } from '@ionic/angular';
import { UtilsService } from 'src/app/_services/utils.service';

declare const google: any;

@Component({
  selector: 'app-pick-location-modal',
  templateUrl: './pick-location-modal.component.html',
  styleUrls: ['./pick-location-modal.component.scss'],
})
export class PickLocationModalComponent implements OnInit {
  map: any;
  center: any;
  position: any;
  marker: any;
  constructor(
    private modalCtrl: ModalController,
    private utils: UtilsService
  ) { }

  ngOnInit() {
    this.utils.getCurrentPosition().then((coords: any) => {
      this.center = coords;
    }).catch(() => {
      this.center = {
        lat: 38.9965049,
        lng: -77.0189145
      };
    });
  }

  mapReady(e, searchBar: IonSearchbar) {
    this.map = e;
    this.initAddressAuthComplete(searchBar);
  }

  initAddressAuthComplete(searchBar) {
    searchBar.getInputElement().then((el) => {
      console.log('searchbox', el);
      const autocomplete = new google.maps.places.Autocomplete(el);
      autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        console.log('place', place);
        if (!place.geometry) {
          console.error('No details avalilable for input: ' + place.name);
          this.utils.presentWarningAlert('No details avalilable for input: ' + place.name);
          return;
        }
        if (place.geometry.viewport) {
          this.map.fitBounds(place.geometry.viewport);
        } else {
          this.map.setCenter(place.geometry.location);
        }
        let address = '', city = '', state = '', zip = '', country = '';
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < place.address_components.length; i++) {
          const addr = place.address_components[i];
          if (addr.types[0] === 'country') {
            country = addr.long_name;
          } else if (addr.types[0] === 'street_address' || addr.types[0] === 'establishment'
            || addr.types[0] === 'route' || addr.types[0] === 'political') {
            address = address + addr.long_name;
          } else if (addr.types[0] === 'postal_code') {
            zip = addr.short_name;
          } else if (addr.types[0].includes('administrative_area_level_1')) {
            state = addr.long_name;
          } else if (addr.types[0].includes('locality')) {
            city = addr.long_name;
          }
        }
        this.position = {
          country,
          state,
          city,
          address,
          zip,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        console.log('position', this.position);
      });
    });
  }

  mapDblClick(e) {
    console.log('mapDblClick', e);
    this.getAddressFromLatLng(e.coords).then((pos: any) => {
      console.log('pos', pos);
      this.position = pos;
    }).catch((err) => {
      this.utils.presentWarningAlert(err.error);
    });
  }

  getAddressFromLatLng(coords: any) {
    const latLng = new google.maps.LatLng(coords.lat, coords.lng);
    return new Promise((resolve, reject) => {
      // tslint:disable-next-line: new-parens
      const geocoder = new google.maps.Geocoder;
      geocoder.geocode({location: latLng}, (results: any, status: any) => {
        if (status === 'OK') {
          if (results[0]) {
            let address = '', city = '', state = '', zip = '', country = '';
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < results[0].address_components.length; i++) {
              const addr = results[0].address_components[i];
              if (addr.types[0] === 'country') {
                country = addr.long_name;
              } else if (addr.types[0] === 'street_address' || addr.types[0] === 'establishment'
                || addr.types[0] === 'route' || addr.types[0] === 'political') {
                address = address + addr.long_name;
              } else if (addr.types[0] === 'postal_code') {
                zip = addr.short_name;
              } else if (addr.types[0].includes('administrative_area_level_1')) {
                state = addr.long_name;
              } else if (addr.types[0].includes('locality')) {
                city = addr.long_name;
              }
            }
            const place = {
              country,
              state,
              city,
              address,
              zip,
              lat: coords.lat,
              lng: coords.lng
            };
            resolve(place);
          } else {
            console.log('Error', 'No results founds');
            reject({ error: 'No results founds' });
          }
        } else {
          console.log('Error', 'Geocoder failed due to: ' + status);
          reject({ error: 'Geocoder failed due to: ' + status });
        }
      });
    });
  }

  changeMarker(coords) {
    if (this.marker) {
      this.marker.setPosition({lat: coords.lat, lng: coords.lng});
    } else {
      this.marker = new google.maps.Marker({
        position: {lat: coords.lat, lng: coords.lng},
        icon: 'assets/icon/pin.png',
        map: this.map
      });
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onSubmit() {
    this.modalCtrl.dismiss(this.position);
  }

}
