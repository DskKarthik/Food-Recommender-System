import { Component, OnInit } from '@angular/core';
import { FrsDataService } from '../frs-data.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

public arr: any;
public total: number;
public userDetails: any;

  constructor(public frsService: FrsDataService,  public router: Router) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('cartArray')!=null){
      this.arr = JSON.parse(sessionStorage.getItem('cartArray'))
    }
    else{
      alert("Cart is empty.")
    }

    this.subTotal();

  }

  onOrder(){
    
    if(!this.frsService.userName || !this.frsService.restName)
    {
      alert("Please Login to place Order")
      this.router.navigateByUrl('/login')
    }
    else{
    this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'))
    this.arr = JSON.parse(sessionStorage.getItem('cartArray'))

    let object = {
      "userDetails": this.userDetails,
      "cart": this.arr
    }
    
    this.frsService.updateOrder(object).subscribe(
      data => {
      console.log(JSON.stringify(object))
      },
      
      error => {
        console.log("Some error has occured"+JSON.stringify(error));
      }
    )
  }
  }

  updateCart() {

    // for i in range(arr.length):
    //   this.arr[i].total = arr[i].dishPrice*quantity
    for(let i=0; i<this.arr.length; i++)
    {
      let quant = (<HTMLInputElement>document.getElementById('quantity'+i.toString())).value
      this.arr[i].totalCost = this.arr[i].dishPrice*parseInt(quant);
      this.arr[i].quantity = parseInt(quant);
    }

    this.subTotal();
    sessionStorage.setItem('cartArray', JSON.stringify(this.arr));

    // alert("1. " + (<HTMLInputElement>document.getElementById('quantity0')).value + "2. " + (<HTMLInputElement>document.getElementById('quantity1')).value);
    // alert("1. " + document.querySelector('input')[0].value; )
    // document.querySelector('input')[0].value;
    // document.querySelector('input')[1].value;
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
    // alert(dishId)
    // let new_arr = []
    // for(let i=0; i<this.arr.length; i++)
    // {
    //   if(this.arr[i].dishId == dishId)
    //   {}
    //   else{
    //     new_arr.push(this.arr[i])
    //   }
    // }
    // this.arr = new_arr

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
