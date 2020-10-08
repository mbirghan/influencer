import { Component, NgZone, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-online-card',
  templateUrl: './online-card.component.html',
  styleUrls: ['./online-card.component.scss']
})
export class OnlineCardComponent implements OnInit {

  rawData = {};
  startDate = (Math.floor(Date.now() / 1000) - (3600 * 24 * 30) + 1);
  endDate = Math.floor(Date.now() / 1000);
  chartOption = {};

  data = [{data: []}];
  type = 'bar';
  options = {
      responsive: true,
    };
  legend = false;
  labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  constructor( private ds : DataService, public ngZone: NgZone) { }

  ngOnInit(): void {
    this.ds.getOnlineFollowers().subscribe((response) => {
      console.log(response);
      
      this.rawData = response;
      this.ngZone.run( () => this.buildChart());
    });
  }

  buildData(rawData) {
    let dataPoints = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    let count = 0;

    Object.keys(rawData).forEach(element => {
      if(Object.keys(rawData[element]).length > 0) count += 1;
    })

    this.labels.forEach((index) => {
      Object.keys(rawData).forEach(element => {
        if(Object.keys(rawData[element]).length > 0) {
          dataPoints[index] += rawData[element][index];
        }
      });
    })
    console.log(dataPoints, count);
    
    dataPoints.forEach((e, i) => {
      dataPoints[i] = Math.round(dataPoints[i]/count);
      
    })

    let normalizedDataPoints = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    dataPoints.forEach((e, i) => {
      normalizedDataPoints[(i+7)%24] = dataPoints[i]
      
    })

    this.data = [({data: normalizedDataPoints})];
  }

  buildChart() {
    this.buildData(this.rawData);
  }

}
