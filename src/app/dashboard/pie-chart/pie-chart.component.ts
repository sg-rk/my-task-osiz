import { OnInit } from "@angular/core";
import { Component, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries | any;
  chart: ApexChart | any;
  responsive: ApexResponsive[] | any;
  labels: any;
};

@Component({
  selector: "app-pie-chart",
  templateUrl: "./pie-chart.component.html",
  styleUrls: ["./pie-chart.component.css"],
})
export class PieChartComponent implements OnInit {
  @ViewChild("chart")
  chart: ChartComponent = new ChartComponent;

  public chartOptions!: Partial<ChartOptions>;

  chartLoading : boolean = true;

  constructor() {    
  }

  ngOnInit(){  
    this.setCharts();      
  }

  setCharts(){
    this.chartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        width: '400px',
        type: "pie",
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1000
        }
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: '100%',
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    };
    this.chartLoading = false;
  }
}
