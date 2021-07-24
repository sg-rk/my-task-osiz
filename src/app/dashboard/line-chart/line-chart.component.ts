import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip
} from "ng-apexcharts";
import { DashboardService } from "../dashboard.service";

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  public series: ApexAxisChartSeries | any;
  public chart: ApexChart | any;
  public dataLabels: ApexDataLabels | any;
  public markers: ApexMarkers | any;
  public title: ApexTitleSubtitle | any;
  public fill: ApexFill | any;
  public yaxis: ApexYAxis | any;
  public xaxis: ApexXAxis | any;
  public tooltip: ApexTooltip | any;

  date : Date = new Date();  
  startDateTime : any = new Date();
  customNow !: any;

  constructor(
    private ds: DashboardService,
    private datepipe : DatePipe
  ) {
    this.startDateTime.setFullYear(this.startDateTime.getFullYear() - 1);
    this.customNow = this.datepipe.transform(this.date, 'yyyy-MM-ddTHH:mm');
    this.startDateTime = this.datepipe.transform(this.startDateTime, 'yyyy-MM-ddTHH:mm');
  }

  lineData : any = [];
  loading: boolean = true;
  chartLoading: boolean = false;

  dates: any = [];

  currentFilter: any = null;

  ngOnInit(){
    this.getPriceHistory();
  }

  getPriceHistory(...args: any){

    if(this.startDateTime > this.customNow){
      alert('Invalid date');
      return;
    }

    this.chartLoading = true;
    this.lineData = [];
    
    if(args && args[0] == 'S')
      this.currentFilter = args[0];

    this.ds.getPriceHistory(this.startDateTime, this.customNow).subscribe(
      (res: any) => {
        this.lineData = res.data.entries;
        this.initChartData();
      },
      (error: any) => {
        alert(error.message);
      }
    ) 
  }

  doFilter(filterType: string){

    let dt = new Date();
    let et = new Date(dt);

    switch (filterType) {
      case 'Y':
        et.setFullYear(dt.getFullYear() - 1);
        break;
      case 'M':
        et.setMonth(dt.getMonth() - 1);
        break;
      case 'w':
        et.setDate(dt.getDate() - 7);
        break;
      case 'd':
        et.setDate(dt.getDate() - 1);
        break;      
      case 'h':
        et.setHours(dt.getHours() - 1);
        break;
      case 'm':
        et.setMinutes(dt.getMinutes() - 1);
        break;        
      default:
        alert('Something went wrong');
        break;
    }
    this.currentFilter = filterType;
    console.log(et, dt)
    this.customNow = this.datepipe.transform(dt, 'yyyy-MM-ddTHH:mm');
    this.startDateTime = this.datepipe.transform(et, 'yyyy-MM-ddTHH:mm');

    this.getPriceHistory();
  }

  public initChartData(): void {
    this.series = [
      {
        name: "USD Price",
        data: this.lineData
      }
    ];
    this.chart = {
      type: "area",
      stacked: false,
      height: 350,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: "zoom"
      }
    };
    this.dataLabels = {
      enabled: false
    };
    this.markers = {
      size: 0
    };
    this.title = {
      text: "Bit Coin Price Movement",
      align: "left"
    };
    this.fill = {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    };
    this.yaxis = {
      labels: {
        formatter: function(val: any) {
          // console.log(val);
          return (val / 1).toFixed(2);
        }
      },
      title: {
        text: "USD Price"
      }
    };
    this.xaxis = {
      type: "datetime"
    };
    this.tooltip = {
      shared: false,
      y: {
        formatter: function(val: any) {
          // console.log(val);
          return (val / 1).toFixed(2);
        }
      }
    };

    this.loading = false;

    console.log(this.customNow);
    this.startUpdate();
    
  }

  interval: any;
  startUpdate(){
    this.interval = setInterval(()=>{

      this.ds.getCurrentPrice().subscribe(
        (res: any) => {
          let str = res.time.updatedISO;
          let timeST = new Date(str).getTime();
          console.log([timeST, Number(res.bpi.USD.rate_float.toFixed(2))])
          this.series[0].data.push([timeST, Number(res.bpi.USD.rate_float.toFixed(2))]);
        },
        (error: any) => {
          alert('Something went wrong !!');
          console.error(error.message);
        }
      )
    }, 1000)
  }

  stopGetting(){
    clearInterval(this.interval);
  }
}
