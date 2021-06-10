import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-restaurant-admin',
  templateUrl: './restaurant-admin.component.html',
  styleUrls: ['./restaurant-admin.component.scss']
})
export class RestaurantAdminComponent implements OnInit {

  public restaurantName: string;

  constructor() { }

  ngOnInit(): void {
    this.restaurantName = JSON.parse(sessionStorage.getItem('restDetails')).restName
  }

}
