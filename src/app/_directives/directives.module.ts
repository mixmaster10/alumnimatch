import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AMDirective } from './am.directive';



@NgModule({
  declarations: [AMDirective],
  imports: [
    CommonModule
  ],
  exports: [
    AMDirective
  ]
})
export class DirectivesModule { }
