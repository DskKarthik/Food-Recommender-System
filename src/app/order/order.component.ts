import { Component, OnInit } from '@angular/core';
import { FrsDataService } from '../frs-data.service';
import { ActivatedRoute, Router} from '@angular/router';
import { query } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  constructor(public frsService: FrsDataService, public toastr: ToastrService) { }

numSequence(n: number): Array<number> {
    return Array(n);
  }

  public tabChangeCity = "Hyderabad";

  public selected_city = "Hyderabad";
  public restList: any = [];
  public restCount: number;
  public searchList: any = []
  public searchCount: number;
  public query: string;
  public isSearch: boolean = false;
  public arr = []

  ngOnInit(): void {
    this.getRestaurantsMethod(this.selected_city);
  }

  getRestaurantsMethod(city) {
    this.frsService.getRestaurants(city).subscribe(
      data => {
        this.restList =  data["Restaurant details"];
        this.restCount = this.restList.length
      //   for(let key in this.restList){
      //   if(this.restList.hasOwnProperty(key)){
      //     this.arr.push(this.restList[key]);
      //   }
      // }
      //  console.log(typeof this.arr)
      },
      
      error => {
        console.log("Some error has occured"+JSON.stringify(error));
      }
    )
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
    this.getRestaurantsMethod(this.tabChangeCity);
  }

  onSearch(){
    this.toastr.success("'"+this.query+"'", 'Restaurants containing')
    this.searchList = []
    for(let i=0; i<this.restList.length; i++)
    {
      if(this.restList[i].restName.toString().toLowerCase().includes(this.query.toLowerCase()))
      {
        this.searchList.push(this.restList[i])
        this.searchCount = this.searchList.length
      }

    }
    console.log(this.searchList)
    this.isSearch = true
  }

  setRestaurantName(restName){
    sessionStorage.setItem('restName', restName)
  }

}
