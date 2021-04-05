import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardPageModule),
      },
      { path: 'nearme', loadChildren: () => import('./nearme/nearme.module').then((m) => m.NearmePageModule) },
      { path: 'leaderboard', loadChildren: () => import('./leaderboard/leaderboard.module').then((m) => m.LeaderboardPageModule) },
      { path: 'bulletinboard', loadChildren: () => import('./bulletinboard/bulletinboard.module').then((m) => m.BulletinboardPageModule) },
      { path: 'messages', loadChildren: () => import('./messages/messages.module').then((m) => m.MessagesPageModule) },
      { path: 'friends', loadChildren: () => import('./friends/friends.module').then((m) => m.FriendsPageModule) },
      { path: 'privacy-requests', loadChildren: () => import('./privacy-requests/privacy-requests.module').then((m) => m.PrivacyRequestsPageModule) },
      { path: 'search', loadChildren: () => import('./search/search.module').then((m) => m.SearchPageModule) },
      { path: 'user', loadChildren: () => import('./user/user.module').then((m) => m.UserPageModule) },
      { path: 'invite-code', loadChildren: () => import('./invite-code/invite-code.module').then((m) => m.InviteCodePageModule) },
    ],
  },
  { path: 'invite-code', loadChildren: './invite-code/invite-code.module#InviteCodePageModule' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
