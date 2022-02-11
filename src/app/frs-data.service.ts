import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class FrsDataService {

  public baseUrl = 'http://localhost:5000';

  public cartArray = [];
  public cartCount: number = 0;
  public email: any;
  public name: any;
  public restName: any;
  public isAdmin: boolean = false;
  public isRestaurant: boolean = false;

  constructor(private _http: HttpClient) { }

  private subject = new Subject(); 

  sendMessage(message) {
     this.subject.next(message); 
  }

  onMessage(): Observable<any> { return this.subject.asObservable(); }
  

  public postLoginActivities() {
    if(sessionStorage.getItem('userDetails') != null) {
      this.email = JSON.parse(sessionStorage.getItem('userDetails')).Email;
      this.name = JSON.parse(sessionStorage.getItem('userDetails')).Name;

      let p = JSON.parse(sessionStorage.getItem('userDetails')).privelege
      if(p=="A")
      {
        this.isAdmin = true;
      }
    }

    if(sessionStorage.getItem('restDetails') != null) {
      this.restName = JSON.parse(sessionStorage.getItem('restDetails')).restName;
      {
        this.isRestaurant = true;
      }
    }

  }

  public getProductArrays(): any {
    let myResponse = this._http.get(this.baseUrl + '/getProductArray');

    return myResponse;
  }

  public createUser(data): any {
    let myResponse = this._http.post(this.baseUrl + '/updateUser', data);

    return myResponse;
  }

  public login(data): any {
    let myResponse = this._http.post(this.baseUrl + '/verifyUser', data);

    return myResponse;
  }

  public createRestaurant(data): any{
    let myResponse = this._http.post(this.baseUrl + '/updateRestaurant', data);
    return myResponse;
  }

  public createDish(data): any{
    let myResponse = this._http.post(this.baseUrl+ '/addDish', data)
    return myResponse
  }

  public getRestaurants(data): any{
    let myResponse = this._http.get(this.baseUrl + '/getRestaurants?city=' + data);
    return myResponse;
  }

  public getDishes(data): any{
    let myResponse = this._http.get(this.baseUrl + '/getDishes/' + data);
    return myResponse;
  }

  public getDishDetails(dishId): any{
    let myResponse = this._http.get(this.baseUrl + '/item-details/' + dishId);
    return myResponse;
  }

  public async updateOrder(data): Promise<any>{
    let myResponse = await this._http.post(this.baseUrl + '/updateOrder', data).toPromise();
    return myResponse;
  }

  public adminStats(): any{
    let myResponse = this._http.get(this.baseUrl + '/adminStats');
    return myResponse;
  }


  public restLogin(data): any {
    let myResponse = this._http.post(this.baseUrl + '/verifyRest', data);

    return myResponse;
  }

  public getOrders(user_id): any{
    let myResponse = this._http.get(this.baseUrl+ '/getOrders/'+user_id)
    return myResponse;
  }

  public async getLatestOrderId(user_id): Promise<any>{
    let myResponse = await this._http.get(this.baseUrl+ '/getLatestOrderId/'+user_id).toPromise();
    return myResponse;
  }
  
  public getOrderStatus(orderId): any{
    let myResponse = this._http.get(this.baseUrl+ '/getOrderStatus?orderId='+orderId)
    return myResponse;
  }

  public updateOrderStatus(data): any{
    let myResponse = this._http.post(this.baseUrl+ '/updateOrderStatus', data)
    return myResponse
  }

  public updateDishRating(data): any{
    let myResponse = this._http.post(this.baseUrl+ '/updateRating', data)
    return myResponse
  }

  public getTrendingAndPopularDishes(city): any{
    let myResponse = this._http.get(this.baseUrl+ '/getPopularTrending/'+city)
    return myResponse
  }

  public getUserRecommendations(user_id): any{
    let myResponse = this._http.get(this.baseUrl+ '/userRecommendations/'+user_id)
    return myResponse
  }

  public getUserStats(user_id): any{
    let myResponse = this._http.get(this.baseUrl+ '/getUserStats/'+user_id)
    return myResponse
  }

  public restaurants = [
    {
      "name": "Rest 1",
      "restId": 101,
      "dishIds": [20, 1,2,13,5]
    },

    {
      "name": "Rest 2",
      "restId": 102,
      "dishIds": [20, 1,12,3,5]
    },

    {
      "name": "Rest 3",
      "restId": 105,
      "dishIds": [20, 1,25,3,5]
    },

    {
      "name": "Rest 4",
      "restId": 110,
      "dishIds": [20, 1,2,3,5]
    }

  ]
  
}
