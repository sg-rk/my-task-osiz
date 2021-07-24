import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardService } from './dashboard.service';
import { LineChartComponent } from './line-chart/line-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashboardComponent,
    LineChartComponent,
    PieChartComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    NgApexchartsModule,
  ],
  providers: [
    DashboardService,
    DatePipe
  ]
})
export class DashboardModule { }
