import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-follower-card',
  templateUrl: './follower-card.component.html',
  styleUrls: ['./follower-card.component.scss']
})
export class FollowerCardComponent implements OnInit {

  rawData = {};
  startDate = (Math.floor(Date.now() / 1000) - (3600 * 24 * 30) + 1);
  endDate = Math.floor(Date.now() / 1000);
  chartOption = {};

  panelOpenState = false;

  constructor(private ref: ChangeDetectorRef, private ds : DataService) { }

  ngOnInit(): void {
    this.ds.getFollowerCount().subscribe((response) => {
      this.rawData = response;
      this.buildChart();
    });
  }

  buildChart(rawData = this.rawData) {
    let dataPoints = [];

    Object.keys(rawData).sort().map((x) => {
      dataPoints.push(rawData[x]);
    });
    
    this.chartOption = {
      xAxis: {
        type: 'category',
        data: Object.keys(rawData).sort().map((timestamp) => {
          let date = new Date(timestamp);
          let dateString = date.getUTCDate() + "." + (date.getUTCMonth()+1) + ".";
          return dateString;
        }),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: dataPoints,
          type: 'line',
        },
      ],
    };

    this.ref.detectChanges();
  }

}
