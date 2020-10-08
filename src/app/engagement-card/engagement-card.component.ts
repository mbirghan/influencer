import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService } from '../data.service';


@Component({
  selector: 'app-engagement-card',
  templateUrl: './engagement-card.component.html',
  styleUrls: ['./engagement-card.component.scss']
})
export class EngagementCardComponent implements OnInit {

  rawData = {};
  startDate = (Math.floor(Date.now() / 1000) - (3600 * 24 * 30) + 1);
  endDate = Math.floor(Date.now() / 1000);
  chartOption = {};
  selected = new FormControl(1);

  data = [{data: []}];
  type = 'line';
  options = {
      responsive: true,
      elements: {
        point: {
          radius: 0,
        },
        line: {
            tension: 0,
            fill: false,
        }
      },
    };
  legend = false;
  labels = [];

  constructor( private ds : DataService, public ngZone: NgZone) { }

  ngOnInit(): void {
    this.ds.getFollowerCount().subscribe((response) => {
      this.rawData = response;
      this.ngZone.run( () => this.buildChart());
    });
  }

  buildData(rawData) {
    let dataPoints = [];

    Object.keys(rawData).sort().map((x) => {
      dataPoints.push(rawData[x]);
    });

    this.data = [({data: dataPoints})];
  }

  buildLabels(rawData) {
    this.labels = Object.keys(rawData).sort().map((timestamp) => {
      let date = new Date(timestamp);
      let dateString = date.getUTCDate() + "." + (date.getUTCMonth()+1) + ".";
      return dateString;
    });
  }

  buildChart() {
    
    this.buildData(this.rawData);
    this.buildLabels(this.rawData);
  }

  changePeriod(selectedIndex) {
    console.log(selectedIndex);
    this.selected.setValue(selectedIndex);
    if(selectedIndex === 0) {
      let startDate = (Math.floor(Date.now() / 1000) - (3600 * 24 * 7) + 1);
      this.ds.getFollowerCount(startDate).subscribe((response) => {
        this.rawData = response;
        this.ngZone.run( () => this.buildChart());
      });
    } else if(selectedIndex === 2) {
      let startDate = (Math.floor(Date.now() / 1000) - (3600 * 24 * 365) + 1);
      this.ds.getFollowerCount(startDate).subscribe((response) => {
        this.rawData = response;
        this.ngZone.run( () => this.buildChart());
      });
    } else {
      this.ds.getFollowerCount().subscribe((response) => {
        this.rawData = response;
        this.ngZone.run( () => this.buildChart());
      });
    }
  }

}
