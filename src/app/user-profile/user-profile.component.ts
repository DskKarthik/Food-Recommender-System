import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FrsDataService } from '../frs-data.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  public userDetails: any;
  public arr = [1,2,3,4,5,6];
  public orders: any;
  public orderStatus: string = '0';
  public orderStatusDisplay: string;
  public subscription: Subscription;

  constructor(public frsService: FrsDataService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('userDetails') != null) {
      this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    }

    this.subscription = this.frsService.onMessage().subscribe(message => {
      let currentOrderId = message.orderId
      let currentOrderStatus = message.status

      for(let order of this.orders)
      {
        if(order.orderDetails.orderId == currentOrderId)
        {
          order.orderDetails.orderStatus = currentOrderStatus
        }
      }

      // this.orderStatus = message.text;
      // this.setOrderStatusDisplay();
    });

    // console.log(JSON.stringify(this.userDetails))

    this.frsService.getOrders(this.userDetails._id).subscribe(
      data => {
      this.orders = data
      // this.setOrderStatusDisplay();
      console.log(JSON.stringify(data))
      },
      
      error => {
        console.log("Some error has occured"+JSON.stringify(error));
      }
    )

  }

  setOrderStatusDisplay(orderStatus)
  {
      if(orderStatus=='0')
        return "Preparing"
      else if(orderStatus=='1')
      return "Delivering"
      else{
        return "Delivered"
      }
  }

}
