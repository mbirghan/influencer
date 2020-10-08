import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion'
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { NgxEchartsModule } from 'ngx-echarts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ChartsModule } from 'ng2-charts';
 
// /**
//  * This will import all modules from echarts.
//  * If you only need custom modules,
//  * please refer to [Custom Build] section.
//  */
// import * as echarts from 'echarts';
import { LoginscreenComponent } from './loginscreen/loginscreen.component';
import { FollowerCardComponent } from './follower-card/follower-card.component';
import { EngagementCardComponent } from './engagement-card/engagement-card.component';
import { OnlineCardComponent } from './online-card/online-card.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginscreenComponent,
    FollowerCardComponent,
    EngagementCardComponent,
    OnlineCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    // NgxEchartsModule.forRoot({ echarts }),
    NgbModule,
    ChartsModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
