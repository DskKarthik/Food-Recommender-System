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
  public trending;
  public popular;
  public health_based;
  public user_based;
  public user_id;
  public name;

  public tabChangeCity = "Hyderabad";
  public selected_city = "Hyderabad";

  ngOnInit(): void {

    if((sessionStorage.getItem('userDetails')!=null))
      this.user_id = JSON.parse(sessionStorage.getItem('userDetails'))._id;
    else
      this.user_id=null
    
    if((sessionStorage.getItem('userDetails')!=null))
      this.name = JSON.parse(sessionStorage.getItem('userDetails')).Name;
    else
      this.name=null

      let userId = this.user_id
      if(!this.user_id)
        userId = 0
      this.frsService.getUserRecommendations(userId).subscribe(
        data => {

          if(this.user_id){
          this.user_based = data['user_based']
          this.health_based = data['health_based']
          }
          this.popular = data['popular']
          this.trending = data['trending_list']
          console.log(data);
        },
        
        error => {
          console.log("Some error has occured"+JSON.stringify(error.errorMessage));
        }
      )

    // this.frsService.getTrendingAndPopularDishes(this.selected_city).subscribe(
    //   data => {
    //     this.trendingArray = data['trending']
    //     // this.popularArray = this.userRecommendations['popular']
    //     this.healthArray = data['health']
    //     // console.log(data);
    //   },
      
    //   error => {
    //     console.log("Some error has occured"+JSON.stringify(error.errorMessage));
    //   }
    // )

  }

  roundRating(rating){
    return Math.round(rating)
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
    // this.getDishesMethod(this.tabChangeCity);
  }

  // public getDishesMethod(city){
  //   this.frsService.getTrendingAndPopularDishes(city).subscribe(
  //     data => {
  //       this.trendingArray = data['trending']
  //       this.popularArray = data['popular']
  //       this.healthArray = data['health']
  //       console.log(data);
  //     },
      
  //     error => {
  //       console.log("Some error has occured"+JSON.stringify(error.errorMessage));
  //     }
  //   )
  // }

  numSequence(n: number): Array<number> {
    return Array(n);
  }
}
