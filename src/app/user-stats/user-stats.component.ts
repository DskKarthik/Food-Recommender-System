import { Component, OnInit } from '@angular/core';
import { FrsDataService } from '../frs-data.service';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.scss']
})
export class UserStatsComponent implements OnInit {

  public statsData;
  public userDetails: any;
  public chartType: string = 'pie';
  public chartDatasets: Array<any> = [
    { data: [300, 50, 100, 40, 120], label: 'My First dataset' }
  ];

  public chartLabels: Array<any> = ['Red', 'Green', 'Yellow', 'Grey', 'Dark Grey'];

  public chartColors: Array<any> = [
    {
      backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
      hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774'],
      borderWidth: 2,
    }
  ];

  public chartOptions: any = {
    responsive: true
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

  constructor(public frsService: FrsDataService) {


  }

  ngOnInit(): void {

    if(sessionStorage.getItem('userDetails') != null) {
      this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
      
    }

    this.frsService.getUserStats(this.userDetails._id).subscribe(
      data => {
        this.statsData = data;
        console.log(this.statsData)
        console.log(this.statsData.no_of_orders.toString())
      },
      
      error => {
        console.log("Some error has occured"+JSON.stringify(error));
      }
    )

  }

  public totalOrders() {
    console.log(this.statsData.no_of_orders.toString())
    return this.statsData.no_of_orders.toString()
  }

  public pyChart(){

  }

}
