import { Component, OnInit } from "@angular/core";

import { DashboardService } from "./dashboard.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private ds: DashboardService,
  ) {

  }

  lineData : any = [];

  ngOnInit(){  
    this.getCurrentPrice();
  }

  getCurrentPrice(){
    this.ds.getCurrentPrice().subscribe(
      (res: any) => {
        console.log(res);
        this.lineData.unshift(res);
      },
      (error: any) =>{
        console.error(error);
      }
    )
  }
}
