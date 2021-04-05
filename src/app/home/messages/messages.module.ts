import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MessagesPage } from './messages.page';
import { SharedModule } from 'src/app/_shared/shared.module';
import { DirectivesModule } from 'src/app/_directives/directives.module';
import { UserMessagesComponent } from './user-messages/user-messages.component';
import { ComposeMessageComponent } from './compose-message/compose-message.component';
import { MessageComponent } from './message/message.component';
import { ImageViewComponent } from 'src/app/home/messages/image-view/image-view.component';

const routes: Routes = [
  {
    path: '',
    component: MessagesPage
  },
  // {
  //   path: 'user/:id',
  //   component: UserMessagesComponent
  // },
  {
    path: 'user',
    component: MessageComponent
  },
  {
    path: 'compose',
    component: ComposeMessageComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
    DirectivesModule
  ],
  declarations: [
    MessagesPage,
    UserMessagesComponent,
    ComposeMessageComponent,
    MessageComponent,
    ImageViewComponent
  ]
})
export class MessagesPageModule {}
