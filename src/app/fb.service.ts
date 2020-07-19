import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FB {

  FB: any;

  constructor() { }

  ngOnInit() {
    (window as any).fbAsyncInit = function () {
      this.FB.init({
        appId: '876129052872524',
        cookie: true,
        xfbml: true,
        version: 'v1.0'
      });
      this.FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  login(cb) {

  }

  // api(url: string, options?: any, cb: (r: any)=>void) {

  // }
}
