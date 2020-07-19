import { Injectable } from '@angular/core';
import { Subject, Observable, combineLatest } from 'rxjs';
declare var FB: any;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  loginStatus = new Subject<any>();

  _igId = '';
  _firstPost = '';
  userInfo = {};
  mediaData = {};
  userInsights = {
    "audience_city": {},
    "audience_country": {},
    "audience_gender_age": {},
    "audience_locale": {},
    "email_contacts": {},
    "follower_count": {},
    "get_directions_clicks": {},
    "impressions": {},
    "online_followers": {},
    "phone_call_clicks": {},
    "profile_views": {},
    "reach": {},
    "text_message_clicks": {},
    "website_clicks": {},
  };

  constructor() {
    (window as any).fbAsyncInit = (function () {
      FB.init({
        appId: '876129052872524',
        cookie: true,
        xfbml: true,
        version: 'v1.0'
      });
      FB.AppEvents.logPageView();
      FB.Event.subscribe('auth.statusChange', (response) => {

        if (response.status === "connected") {
          this._getIgId().subscribe((r) => {
            this.loginStatus.next(response.status);
          })
        } else {
          this.loginStatus.next(response.status);
        }

      })
    }).bind(this);

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  }

  isLoggedIn() {
    return this._igId !== '';
  }

  logout() {
    FB.logout();
  }

  login() {
    FB.login();
  }

  _getIgId(): Observable<any> {
    return new Observable((observer) => {
      FB.api('/me/accounts', (response) => {
        FB.api('/' + response.data[0].id, { fields: 'instagram_business_account' }, (response) => {
          this._igId = response.instagram_business_account.id;
          observer.next(this._igId);
          this.getUserInfo();
          // this.getMedia();
        });
      });
    });
  }

  getMedia(): Observable<any> {
    return new Observable((observer) => {
      FB.api('/' + this._igId + '/media', { limit: 0 }, (response) => {
        let media = response.data.map(x => x.id);
        this._getMediaData(media).subscribe((response) => {
          observer.next(response);
        });
      })
    });
  }

  // could be improved with combineLatest()
  _getMediaData(media): Observable<any> {
    return new Observable((o) => {
      let mediaData = {};
      let completed = 0;
      for (let m in media) {
        let metricsCall = new Observable((observer) => {
          FB.api('/' + media[m], { fields: 'comments_count,like_count,media_url,permalink,timestamp,id' }, (metricsResponse) => {
            if ("error" in metricsResponse) {
              observer.error(metricsResponse.error.message);
              return;
            }
            observer.next(metricsResponse);
            observer.complete();
          });
        });

        let insightsCall = new Observable((observer) => {
          FB.api('/' + media[m] + '/insights', { metric: 'engagement,impressions,reach,saved' }, (insightsResponse) => {
            if ("error" in insightsResponse) {
              observer.error(insightsResponse.error.message);
              return;
            }
            let insights = {}
            for (let key in insightsResponse.data) {
              let name = insightsResponse.data[key].name;
              let value = insightsResponse.data[key].values[0].value
              insights[name] = value
            }
            observer.next(insights);
            observer.complete();
          });
        });
        combineLatest(metricsCall, insightsCall, (metrics: any, insights: any) => {
          if(this._firstPost === '' || this._firstPost > metrics.timestamp) {
            this._firstPost = metrics.timestamp;
          }
          return {
            ...metrics,
            ...insights
          };
        }).subscribe((response) => {
          mediaData[media[m]] = response;
          o.next(mediaData);
        }, 
        (err) => {console.error(err)},
        () => { 
          completed += 1;
          if(completed >= media.length) {
            o.complete();  
          }
        });
      }
    });
  }

  getUserInfo(): Observable<any> {
    return new Observable((observer) => {
      FB.api(
        '/' + this._igId,
        { "fields": "id,biography,followers_count,follows_count,ig_id,media_count,name,profile_picture_url,username,website" },
        (response) => {
          if ("error" in response) {
            observer.error(response.error.message);
            return;
          }
          observer.next(response);
        }
      );
    });
  }

  // Start user profile insights

  getAudienceCity(): Observable<any> {
    // lifetime
    return this._insightsAudienceHelper("audience_city");
  }

  getAudienceCountry(): Observable<any> {
    // lifetime
    return this._insightsAudienceHelper("audience_country");
  }

  getAudienceGenderAge(): Observable<any> {
    // lifetime
    return this._insightsAudienceHelper("audience_gender_age");
  }

  getAudienceLocale(): Observable<any> {
    // lifetime
    return this._insightsAudienceHelper("audience_locale");
  }

  _insightsAudienceHelper(metric): Observable<any> {
    return new Observable((observer) => {
      FB.api(
        '/' + this._igId + '/insights',
        { "period": "lifetime", "metric": metric },
        (response) => {
          if ("error" in response) {
            observer.error(response.error.message);
            return;
          }
          observer.next(response.data[0].values[0].value);
        }
      );
    });
  }

  getEmailContacts(since = (Math.floor(Date.now() / 1000) - (3600 * 24 * 30) + 1)): Observable<any> {
    // day
    return this._insightsHelper("email_contacts", since);
  }

  getFollowerCount(since = (Math.floor(Date.now() / 1000) - (3600 * 24 * 30) + 1)): Observable<any> {
    // day
    return this._insightsHelper("follower_count", since);
  }

  getDirectionsClicks(since = (Math.floor(Date.now() / 1000) - (3600 * 24 * 30) + 1)): Observable<any> {
    // day
    return this._insightsHelper("get_directions_clicks", since);
  }

  getImpressions(since = (Math.floor(Date.now() / 1000) - (3600 * 24 * 30) + 1)): Observable<any> {
    // day, week, days_28
    // Since week and days_28 are just accumulations of the individual days it is enough to get the days
    return this._insightsHelper("impressions", since);
  }

  getReach(since = (Math.floor(Date.now() / 1000) - (3600 * 24 * 30) + 1)): Observable<any> {
    // day, week, days_28
    // Since week and days_28 are just accumulations of the individual days it is enough to get the days
    return this._insightsHelper("reach", since);
  }

  getOnlineFollowers(since = (Math.floor(Date.now() / 1000) - (3600 * 24 * 30) + 1)): Observable<any> {
    // lifetime
    return this._insightsHelper("online_followers", since, "lifetime");
  }

  getPhoneCallClicks(since = (Math.floor(Date.now() / 1000) - (3600 * 24 * 30) + 1)): Observable<any> {
    // day
    return this._insightsHelper("phone_call_clicks", since);
  }

  getProfileViews(since = (Math.floor(Date.now() / 1000) - (3600 * 24 * 30) + 1)): Observable<any> {
    // day
    return this._insightsHelper("profile_views", since);
  }

  getTextMessageClicks(since = (Math.floor(Date.now() / 1000) - (3600 * 24 * 30) + 1)): Observable<any> {
    // day
    return this._insightsHelper("text_message_clicks", since);
  }

  getWebsiteClicks(since = (Math.floor(Date.now() / 1000) - (3600 * 24 * 30) + 1)): Observable<any> {
    // day
    return this._insightsHelper("website_clicks", since);
  }

  // could be improved with combineLatest()
  _insightsHelper(metric, since, period = "day"): Observable<any> {
    // if(this._firstPost !== '') {
    //   let tmp = Math.floor(Date.parse(this._firstPost)/1000);
    //   if(tmp !== NaN) since = tmp;
    // }
    return new Observable((observer) => {
      let until = Math.floor(Date.now() / 1000);
      let maxSpan = 3600 * 24 * 30;
      let maxUntil = since;
      let result = {};
      let calls = 0;
      let returns = 0;
      let allCalled = false;

      while (maxUntil < until) {
        maxUntil = maxUntil + maxSpan;
        calls += 1;
        FB.api(
          '/' + this._igId + '/insights',
          { "period": period, "metric": metric, "since": since, "until": maxUntil },
          (response) => {
            returns += 1
            if ("error" in response) {
              observer.error(response.error.message);
              return;
            }

            if (response.data.length > 0) {
              response.data[0].values.map((x) => {
                result[x.end_time] = x.value;
              });
              observer.next(result);
              if (allCalled && calls === returns) {
                observer.complete();
              }
            }
          });
        since = maxUntil;
      }
      allCalled = true;
    });
  }

  // End user profile insights
}
