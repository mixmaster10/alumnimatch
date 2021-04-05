import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewSponsorsPage } from './view-sponsors.page';

const routes: Routes = [
    {
      path: '',
      component: ViewSponsorsPage,
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewSponsorRoutingModule {}