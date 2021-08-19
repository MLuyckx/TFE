
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CartographyComponent } from './cartography/cartography.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LivestreamComponent } from './livestream/livestream.component';
import { ReplayinterComponent } from './replayinter/replayinter.component';
import { ReplaysComponent } from './replays/replays.component';
import { StatisticsComponent } from './statistics/statistics.component';

const routes: Routes = [
  {path: 'live', component: LivestreamComponent},
  {path: 'inters', component: ReplaysComponent},
  {path: 'replay', component: ReplayinterComponent},
  {path: 'stats', component: StatisticsComponent},
  // {path: 'carto', component: CartographyComponent},
  {path: 'limited', component: LivestreamComponent},
  {path: '**', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
