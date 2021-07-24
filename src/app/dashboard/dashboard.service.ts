import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DashboardService {

  date : any = new Date();  
  lastYearDate : any = new Date();
  customNow !: any;
  
  constructor(
    private datepipe: DatePipe,
    private http: HttpClient
  ) {
    this.lastYearDate.setFullYear(this.lastYearDate.getFullYear() - 1);
    this.date = this.datepipe.transform(this.date, 'yyyy-MM-dd');
    this.customNow = this.datepipe.transform(this.date, 'yyyy-MM-ddTHH:MM');
    this.lastYearDate = this.datepipe.transform(this.lastYearDate, 'yyyy-MM-dd');
  }

  getPriceHistoryz(){
    return this.http.get(`https://api.coindesk.com/v1/bpi/historical/INR.json?start=${this.lastYearDate}&end=${this.date}`);    
  }

  getCurrentPrice(): any{
    return this.http.get('https://api.coindesk.com/v1/bpi/currentprice/INR.json');
  }

  getPriceHistory(startDate: any, endDate: any){
    return this.http.get(`https://production.api.coindesk.com/v2/price/values/BTC?start_date=${startDate}&end_date=${endDate}&ohlc=false`);
  }
}
