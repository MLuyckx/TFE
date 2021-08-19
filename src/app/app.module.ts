import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SecurelinkComponent } from './securelink/securelink.component';
import { ReplaysComponent } from './replays/replays.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { LivestreamComponent } from './livestream/livestream.component';
import { HomeComponent } from './home/home.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CartographyComponent } from './cartography/cartography.component';
import { ReplayinterComponent } from './replayinter/replayinter.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    SecurelinkComponent,
    ReplaysComponent,
    HeaderComponent,
    LivestreamComponent,
    HomeComponent,
    StatisticsComponent,
    CartographyComponent,
    ReplayinterComponent,
    FooterComponent
  ],
  imports: [
    ChartsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
