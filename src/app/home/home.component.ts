import { Component, OnInit } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { FrsDataService } from '../frs-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public frsService: FrsDataService) { }

  public productArray;
  public productArray2;
  public city = "Hyderabad";
  public trendingArray;
  public popularArray;
  public healthArray;
  public userRecommendations;
  public userName;

  public tabChangeCity = "Hyderabad";
  public selected_city = "Hyderabad";

  ngOnInit(): void {

    if((sessionStorage.getItem('userDetails')!=null))
      this.userName = JSON.parse(sessionStorage.getItem('userDetails')).username;
    else
      this.userName=null

    this.frsService.getTrendingAndPopularDishes(this.selected_city).subscribe(
      data => {
        this.trendingArray = data['trending']
        this.popularArray = data['popular']
        this.healthArray = data['health']
        console.log(data);
      },
      
      error => {
        console.log("Some error has occured"+JSON.stringify(error.errorMessage));
      }
    )

    if(this.userName)
    {
    this.frsService.getUserRecommendations(this.userName).subscribe(
      data => {
        this.userRecommendations = data
        console.log(data);
      },
      
      error => {
        console.log("Some error has occured"+JSON.stringify(error.errorMessage));
      }
    )
    }

  }

  onTabChanged($event) {
    switch($event.index) {
      case 0: 
        this.tabChangeCity = 'Hyderabad';
        break;
      case 1: 
        this.tabChangeCity = 'Delhi';
        break;
      case 2: 
        this.tabChangeCity = 'Vizag';
        break;
      case 3: 
        this.tabChangeCity = 'Bangalore';
        break;
    }

    console.log(this.tabChangeCity);
    this.getDishesMethod(this.tabChangeCity);
  }

  public getDishesMethod(city){
    this.frsService.getTrendingAndPopularDishes(city).subscribe(
      data => {
        this.trendingArray = data['trending']
        this.popularArray = data['popular']
        this.healthArray = data['health']
        console.log(data);
      },
      
      error => {
        console.log("Some error has occured"+JSON.stringify(error.errorMessage));
      }
    )
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }
}
