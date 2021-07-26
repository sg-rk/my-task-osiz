import { DatePipe } from "@angular/common";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
  ChartComponent,
} from "ng-apexcharts";
import { DashboardService } from "../dashboard.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels | any;
  markers: ApexMarkers | any;
  title: ApexTitleSubtitle;
  fill: ApexFill | any;
  yaxis: ApexYAxis | any;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip | any;
};

@Component({
  selector: "app-line-chart",
  templateUrl: "./line-chart.component.html",
  styleUrls: ["./line-chart.component.css"],
})
export class LineChartComponent implements OnInit, OnDestroy {
  @ViewChild("lineChart") lineChart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;

  date: any = new Date();
  startDateTime: any = new Date();
  customNow!: any;

  constructor(private ds: DashboardService, private datepipe: DatePipe) {
  }

  lineData: any = [];
  loading: boolean = true;
  chartLoading: boolean = false;

  dates: any = [];

  currentFilter: any = null;
  XAxisRange = Number(3600000*24*30);

  ngOnInit() {
    this.date = this.date.toLocaleString("en-US", {timeZone: "UTC"});    

    this.startDateTime.setMonth(this.startDateTime.getMonth() - 1);
    this.startDateTime = this.startDateTime.toLocaleString("en-US", {timeZone: "UTC"});

    this.customNow = this.datepipe.transform(this.date, "yyyy-MM-ddTHH:mm");
    this.startDateTime = this.datepipe.transform(
      this.startDateTime,
      "yyyy-MM-ddTHH:mm"
    );
    this.initChartData();      
  }

  searchFilter(){
    if (this.startDateTime > this.customNow) {
      alert("Invalid date");
      return;
    }

    this.currentFilter = 'S';

    this.startDateTime = this.startDateTime.toLocaleString("en-US", {timeZone: "UTC"});
    this.customNow =  this.customNow.toLocaleString("en-US", {timeZone: "UTC"});

    this.startDateTime = this.datepipe.transform(this.startDateTime, "yyyy-MM-ddTHH:mm");
    this.customNow = this.datepipe.transform(this.customNow, "yyyy-MM-ddTHH:mm");
    
    this.getPriceHistory();
  }

  getPriceHistory() {
    this.lineData = [];

    this.lineChart.updateSeries([{data: this.lineData}]);

    this.ds.getPriceHistory(this.startDateTime, this.customNow).subscribe(
      (res: any) => {
        this.lineData = res.data.entries;
  
        this.chartOptions.xaxis = {
              type: "datetime",
              range: this.XAxisRange
            }
        
        this.lineChart.updateOptions(this.chartOptions);
        this.lineChart.render();
        this.lineChart.updateSeries([{data: this.lineData}]);

        console.log(this.lineChart.xaxis);
        this.chartLoading = false;
        this.startUpdate();
      },
      (error: any) => {
        alert(error.message);
      }
    );
  }

  doFilter(filterType: string) {
    let dt : any = new Date();
    let et : any = new Date(dt);

    switch (filterType) {
      case "Y":
        et.setFullYear(dt.getFullYear() - 1);
        this.XAxisRange = Number(3600000*24*365);
        break;
      case "M":
        et.setMonth(dt.getMonth() - 1);
        this.XAxisRange = Number(3600000*24*30);
        break;
      case "w":
        et.setDate(dt.getDate() - 7);
        this.XAxisRange = Number(3600000*24*7);
        break;
      case "d":
        et.setDate(dt.getDate() - 1);
        this.XAxisRange = Number(3600000*24);
        break;
      case "hd":
        et.setHours(dt.getHours() - 12);
        this.XAxisRange = Number(3600000*12);
        break;
      case "h":
        et.setHours(dt.getHours() - 1);
        this.XAxisRange = 3600000;
        break;
      default:
        alert("Something went wrong");
        break;
    }

    this.currentFilter = filterType;
    console.log(et, dt);

    // dt = new DatePipe('en-US').transform(dt, 'yyyy-MM-ddTHH:mm', 'UTC');
    // et = new DatePipe('en-US').transform(et, 'yyyy-MM-ddTHH:mm', 'UTC');
    dt = dt.toLocaleString("en-US", {timeZone: "UTC"});
    et = et.toLocaleString("en-US", {timeZone: "UTC"});
    console.log(et, dt);

    this.customNow = this.datepipe.transform(dt, "yyyy-MM-ddTHH:mm");
    this.startDateTime = this.datepipe.transform(et, "yyyy-MM-ddTHH:mm");

    console.log(this.customNow, this.startDateTime);
    console.log(et, dt);
    this.getPriceHistory();
  }

  public initChartData(): void {
    this.chartOptions = {
      series: [
        {
          name: "USD Price",
          data: [],
        },
      ],
      stroke: {
        curve: "smooth",
      },
      legend: {
        show: false,
      },
      chart: {
        id: "realtime",
        type: "area",
        stacked: false,
        height: 350,
        zoom: {
          type: "x",
          enabled: false,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: "zoom",
        },
        animations: {
          enabled: true,
          easing: "linear",
          speed: 10,
          animateGradually: {
            enabled: false,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: false,
            speed: 350,
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      title: {
        text: "Bit Coin Price Movement",
        align: "left",
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      yaxis: {
        labels: {
          formatter: function (val: any) {
            return (val / 1).toFixed(2);
          },
        },
        title: {
          text: "USD Price",
        },
      },
      xaxis: {
        type: "datetime",
        range: this.XAxisRange
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val: any) {
            return (val / 1).toFixed(2);
          },
        },
      },
      noData: {
        text: "Loading...",
        align: "center",
        verticalAlign: "middle",
        offsetX: 0,
        offsetY: 0,
        style: {
          color: undefined,
          fontSize: "14px",
          fontFamily: undefined,
        },
      }
    };

    this.loading = false;

    setTimeout(() => {
      this.chartLoading = true;
      this.getPriceHistory();        
    }, 0);
  }

  interval: any;
  startUpdate() {
    this.interval = setInterval(() => {
      this.ds.getCurrentPrice().subscribe(
        (res: any) => {
          let str = res.time.updatedISO;
          let timeST = new Date(str).getTime();
          
          // this.lineData.splice(0,1);
          this.lineData.push([
            timeST,
            Number(res.bpi.USD.rate_float.toFixed(2)),
          ]);

          this.lineChart.updateSeries([{data: this.lineData}]);
        },
        (error: any) => {
          alert("Something went wrong !!");
          console.error(error.message);
        }
      );
    }, 1000);
  }

  stopGetting() {    
    clearInterval(this.interval);
  }

  ngOnDestroy(){
    this.stopGetting();
  }
}
