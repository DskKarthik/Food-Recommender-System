import { Component, OnInit } from '@angular/core';
import { FrsDataService } from '../frs-data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dish-add',
  templateUrl: './dish-add.component.html',
  styleUrls: ['./dish-add.component.scss']
})
export class DishAddComponent implements OnInit {

  public stepIndex: number = 0;
  public dishId: string;
  public dishName: string;
  public actualPrice: number;
  public discPrice: number;
  public dishDesc: string;
  public dishTags: string;

  constructor(public frsService: FrsDataService, public toastr: ToastrService) { }

  ngOnInit(): void {
  }

  registerDish(object){
    this.frsService.createDish(object).subscribe(
      data => {

        this.toastr.success('Hurray! Your dish is now visible to millions.', data.Message)
      },

      error => {
        console.log("Some error has occured"+JSON.stringify(error));
        this.toastr.error('The dish ID already exists in your Restaurant. Kindly choose another Dish ID', 'Error')
      }
    )
  }

  controlSteps(pageName: string) {
      switch(pageName) {
        case 'page1':
          this.stepIndex = 0;
          break;
        case 'register':
          // call backend
          let restName = JSON.parse(sessionStorage.getItem('restDetails')).restName
          let restId = JSON.parse(sessionStorage.getItem('restDetails')).restId
          console.log("Restaurant:"+ restName)
          let object = {
            "restId": restId,
            "dishId": this.dishId,
            "dishName": this.dishName,
            "actualPrice": this.actualPrice,
            "dishDesc": this.dishDesc,
            "dishCount": 0,
            "discPrice": this.discPrice,
            "dishRating": 5
          };

          console.log(JSON.stringify(object));
          this.registerDish(object);

          break;
        default:
          alert('Wow, this should not happen!');
      }
    }

}
