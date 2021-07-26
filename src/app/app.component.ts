import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit  {
  title = 'mytask-osiz';
  pageLoading : boolean = true;
  
  constructor(
  ) {}

  ngAfterViewInit(){
    setTimeout(() => {
      this.pageLoading = false;      
    }, 2000);
  }
  
}
