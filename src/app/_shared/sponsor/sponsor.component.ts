/* 
**** Not being used ****
*/

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sponsor',
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.scss'],
})
export class SponsorComponent implements OnInit {

  @Input() user: any;
  @Input() detailIcon = true;
  @Output() sponsorClick: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {}
  
 viewSponsor() {
    this.sponsorClick.emit(this.user);
  }


}
