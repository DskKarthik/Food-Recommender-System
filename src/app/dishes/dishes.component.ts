import { Component, OnInit } from '@angular/core';
import { FrsDataService } from '../frs-data.service';
import { ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.scss']
})
export class DishesComponent implements OnInit {

  constructor(public frsService: FrsDataService, public _route: ActivatedRoute, public router: Router) { }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

  public restId;
  public dishList;


  ngOnInit(): void {
    this.restId = this._route.snapshot.paramMap.get('restId');
    this.frsService.getDishes(this.restId).subscribe(
      data => {
        this.dishList =  data
      //   for(let key in this.restList){
      //   if(this.restList.hasOwnProperty(key)){
      //     this.arr.push(this.restList[key]);
      //   }
      // }
      console.log(this.dishList)
      },
      
      error => {
        console.log("Some error has occured"+JSON.stringify(error));
      }
    )
  }

}
