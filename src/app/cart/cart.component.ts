import { Component, OnInit } from '@angular/core';
import { FrsDataService } from '../frs-data.service';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})

export class CartComponent implements OnInit {

public arr: any;
public total: number;
public userDetails: any;
public orderDetails: any;
public orderDishes: any = [];
public totalCost: number;
public orderDatetime: any;
public currentOrderId: number;
public orderStatus: string = '0'

  constructor(public frsService: FrsDataService,  public router: Router, public toastr: ToastrService) { }

  ngOnInit(): void {

    if(sessionStorage.getItem('cartArray')!=null){
      this.arr = JSON.parse(sessionStorage.getItem('cartArray'))
    }
    else{
      this.toastr.info("Add dishes to cart to proceed", "Cart is Empty :(")
    }

    this.subTotal();

  }

  computeTotal()
  {
    let total = 0
    for(let i=0; i<this.arr.length; i++)
    {
      total += this.arr[i].totalCost
    }
    console.log(total)
    this.totalCost = total
  }

  prepareDate() {
    let obj = new Date();
    let date;
    if(obj.getMonth() < 9){
      date = obj.getFullYear() + '-0' + (obj.getMonth()+1) + '-' + obj.getDate()
    }
    else{
      date = obj.getFullYear() + '-' + (obj.getMonth()+1) + '-' + obj.getDate()
    }
    let time = obj.getHours() + ':' + obj.getMinutes() + ':' + obj.getSeconds();

    this.orderDatetime = date + ' ' + time
  }

  async updateOrderStatus()
  {
    this.currentOrderId = await this.frsService.getLatestOrderId(this.userDetails._id);
    console.log(this.currentOrderId);
    
    this.orderStatus = '1'

    let object = {
      "orderId": this.currentOrderId,
      "status": this.orderStatus
    }

    setTimeout(() => {
      this.frsService.updateOrderStatus(object).subscribe(
        data => {
          console.log(data)
          this.frsService.sendMessage(object);
          this.orderStatus = '2'
          object = {
            "orderId": this.currentOrderId,
            "status": this.orderStatus
          }


          setTimeout(() => {
            this.frsService.updateOrderStatus(object).subscribe(
              data => {
                console.log(data)
                this.frsService.sendMessage(object);
              }
            )
          }, 30000)
        }
      )
    }, 25000)

  }

  async onOrder(){
    
    if(!this.frsService.email && !this.frsService.restName)
    {
      this.toastr.info("Please Login to place Order", "Login Required")
      this.router.navigateByUrl('/login')
    }
    else{
    this.prepareDate();
    this.computeTotal();
    this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'))
    this.arr = JSON.parse(sessionStorage.getItem('cartArray'))


  this.orderDetails = {

    'restaurant_id' : this.arr[0]['restId'],
    'user_id' : this.userDetails._id,
    'dish_id' : this.arr[0].dishId,
    'cost' : this.arr[0].cost,
    'address' : 'Shiv Nadar University, Noida',
    'rating' : 0,
    "status" : 2


    // "restId": this.arr[0].restId,
    // "username": this.userDetails.username,
    // "actualCost": this.totalCost,
    // "tax": 0.05,
    // "discount": 0,
    // "totalCost": this.totalCost,
    // "orderDatetime":this.orderDatetime,
    // "driverId": 1001,
    // "orderStatus": '0',
    // "houseNo": this.userDetails.houseNo,
    // "locality": this.userDetails.locality,
    // "city": this.userDetails.city,
    // "state": this.userDetails.state,
    // "pincode": this.userDetails.pincode,
    // "deliveryRating": 5,
    // "deliveryFeedback": "Delivery on time.",
    // "restName":this.arr[0].restName
  }


  for(let i=0; i<this.arr.length; i++)
  {
    let orderDish = {
      "restId": this.arr[i].restId,
      "dishId": this.arr[i].dishId,
      "quantity": this.arr[i].quantity,
      "dishName": this.arr[i].dishName,
      "dishPrice": this.arr[i].dishPrice
    }
    this.orderDishes.push(orderDish)
  }

    let object = {
      "orderDetails": this.orderDetails,
      "orderDishes": this.orderDishes
    }
    
    let someData = await this.frsService.updateOrder(this.orderDetails)
    this.toastr.success('', 'Order Placed Successfully !')
    console.log(JSON.stringify(object))
      sessionStorage.setItem('cartArray','[]');
      sessionStorage.setItem('cartCount','0');
      this.frsService.cartArray = [];
      this.frsService.cartCount = 0;

    // this.updateOrderStatus();
  }
  }

  updateCart() {
    for(let i=0; i<this.arr.length; i++)
    {
      let quant = (<HTMLInputElement>document.getElementById('quantity'+i.toString())).value
      this.arr[i].totalCost = this.arr[i].dishPrice*parseInt(quant);
      this.arr[i].quantity = parseInt(quant);
    }

    this.subTotal();
    sessionStorage.setItem('cartArray', JSON.stringify(this.arr));
  }

  subTotal(){
    let sub_total = 0;
    for(let i=0; i<this.arr.length; i++)
    {
      sub_total += this.arr[i].totalCost
    }
    this.total = sub_total;

  }

  onDelete(dishId){

    for(let i=0; i<this.arr.length; i++)
    {
      if(this.arr[i].dishId == dishId)
      {
        this.arr.splice(i,1)
      }
    }
    sessionStorage.setItem('cartArray', JSON.stringify(this.arr));
    let newCount = parseInt(sessionStorage.getItem('cartCount')) -1
    sessionStorage.setItem('cartCount', newCount.toString())
    this.frsService.cartCount--;
  }

}
