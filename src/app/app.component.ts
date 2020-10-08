import { Component, NgZone } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';
  loggedIn = false;
  userInfo = {};
  pictureUrl = "";
  name = "";
  username = "";
  followerCount = "";
  followingCount = "";

  graphs;

  login() {
    this.dataService.login();
  }

  logout() {
    this.dataService.logout();
  }

  changeLogin(userInfo) {
    this.loggedIn = true;
    this.pictureUrl = userInfo.profile_picture_url;
    this.name = userInfo.name;
    this.username = userInfo.username;
    this.followerCount = userInfo.followers_count;
    this.followingCount = userInfo.follows_count;
  }

  constructor(private ngZone: NgZone,
    private dataService: DataService) {
    this.dataService.loginStatus.subscribe((status) => {
      this.loggedIn = status === "connected";
      this.dataService.getUserInfo().subscribe((userInfo) => {
        this.ngZone.run( () => {
          this.userInfo = userInfo;
          this.pictureUrl = userInfo.profile_picture_url;
          this.name = userInfo.name;
          this.username = userInfo.username;
          this.followerCount = userInfo.followers_count;
          this.followingCount = userInfo.follows_count;
        });
      });
    });


  this.graphs = {
    // "audience_city": {},
    // "audience_country": {},
    // "audience_gender_age": {},
    // "audience_locale": {},
    "email_contacts": this.dataService.getEmailContacts.bind(this.dataService),
    "follower_count": this.dataService.getFollowerCount.bind(this.dataService),
    "get_directions_clicks": this.dataService.getDirectionsClicks.bind(this.dataService),
    "impressions": this.dataService.getImpressions.bind(this.dataService),
    "online_followers": this.dataService.getOnlineFollowers.bind(this.dataService),
    "phone_call_clicks": this.dataService.getPhoneCallClicks.bind(this.dataService),
    "profile_views": this.dataService.getProfileViews.bind(this.dataService),
    "reach": this.dataService.getReach.bind(this.dataService),
    "text_message_clicks": this.dataService.getTextMessageClicks.bind(this.dataService),
    "website_clicks": this.dataService.getWebsiteClicks.bind(this.dataService),
  };
  }

  testFollowerCount() {
    let c = 0;
    this.dataService.getMedia().subscribe((response) => {
      c += 1;
      console.log(c);

    });
    // this.dataService.getWebsiteClicks(1589537264);
  }

  isLoggedIn() {
    return this.dataService.isLoggedIn();
  }
}
