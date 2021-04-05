import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/_pipes/pipes.module';

import { HomePage } from './home.page';
import { HomeRoutingModule } from './home-routing.module';
import { DirectivesModule } from '../_directives/directives.module';
import { SharedModule } from '../_shared/shared.module';
import { AddPostComponent } from './bulletinboard/add-post/add-post.component';
import { LoginMessagesComponent } from '../_shared/login-messages/login-messages.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomeRoutingModule, DirectivesModule, SharedModule],
  declarations: [HomePage, AddPostComponent, LoginMessagesComponent],
  entryComponents: [AddPostComponent, LoginMessagesComponent]
})
export class HomePageModule {}
