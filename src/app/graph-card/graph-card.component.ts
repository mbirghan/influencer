import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { EChartOption } from 'echarts';
import { DataService } from '../data.service';

@Component({
  selector: 'app-graph-card',
  templateUrl: './graph-card.component.html',
  styleUrls: ['./graph-card.component.scss']
})
export class GraphCardComponent implements OnInit {

  @Input() metric;
  @Input() function;



  chartOption: EChartOption;

  constructor(private ref: ChangeDetectorRef, private ds: DataService) {
  }

  ngOnInit(): void {
    this.function().subscribe((data) => {
      let dataPoints = [];

      Object.keys(data).sort().map((x) => {
        dataPoints.push(data[x]);
      });

      this.chartOption = {
        xAxis: {
          type: 'category',
          data: Object.keys(data).sort(),
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
    },
    (err) => console.error(err),
    () => console.log("completeted"))
  }

  testFollowerCount() {
    this.ds.getProfileViews(1529057264).subscribe((data) => {
      let dataPoints = [];

      Object.keys(data).sort().map((x) => {
        dataPoints.push(data[x]);
      });

      this.chartOption = {
        xAxis: {
          type: 'category',
          data: Object.keys(data).sort(),
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
    },
    (err) => console.error(err),
    () => console.log("completeted"))
  }

  buildChart(data, error?) {
    console.log("buildChart called");

    if (error !== undefined) {
      console.error(error);
      return;
    }
    let dataPoints = [];

    Object.keys(data).sort().map((x) => {
      dataPoints.push(data[x]);
    });

    this.chartOption = {
      xAxis: {
        type: 'category',
        data: Object.keys(data).sort(),
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

    //   console.log(dataPoints);

    //   let chart = new CanvasJS.Chart("chartContainer", {
    //     zoomEnabled: true,
    //     animationEnabled: true,
    //     exportEnabled: true,
    //     title: {
    //       text: "Performance Demo - 10000 DataPoints"
    //     },
    //     subtitles:[{
    //       text: "Try Zooming and Panning"
    //     }],
    //     data: [
    //     {
    //       type: "line",                
    //       dataPoints: dataPoints
    //     }]
    //   });

    //   chart.render();
  }

}
