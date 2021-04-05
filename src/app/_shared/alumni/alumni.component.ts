import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { College } from 'src/app/profile/_components/ps-colleges/ps-colleges.component';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-alumni',
  templateUrl: './alumni.component.html',
  styleUrls: ['./alumni.component.scss'],
})
export class AlumniComponent implements OnInit {

  @Input() user: any;
  @Input() detailIcon = true;
  @Output() profileClick: EventEmitter<any> = new EventEmitter();
  
  currentUserCollege: College;
  
  constructor() {
    this.currentUserCollege = JSON.parse(localStorage.college)
  }

  ngOnInit() {
    
  }

  viewProfile() {
    this.profileClick.emit(this.user);
  }

}
