import { Component, ChangeDetectorRef } from '@angular/core';
declare var FB: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';
  igId = '';
  media = [];

  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: '876129052872524',
        cookie: true,
        xfbml: true,
        version: 'v1.0'
      });
      FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  submitLogin() {
    console.log("submit login to facebook");
    // FB.login();
    FB.login((response) => {
      console.log('submitLogin', response);
      if (response.authResponse) {
        //login success
        //login success code here
        //redirect to home page
        console.log("login success");
        console.log(response.authResponse.accessToken);
        this.getIgId()
      }
      else {
        console.log('User login failed');
      }
    });

  }

  getIgId() {
    FB.api('/me/accounts', (response) => {
      FB.api('/' + response.data[0].id, { fields: 'instagram_business_account' }, (response) => {
        this.igId = response.instagram_business_account.id;
        this.ref.detectChanges();
        this.getMedia();
      });
    });
  }

  getMedia() {
    if(this.igId === '') return;

    FB.api('/' + this.igId + '/media', {limit: 0}, (response) => {
      this.media = response.data.map(x => x.id);
      this.ref.detectChanges();
    })
  }
}
