import { Component, OnInit } from '@angular/core';
import { FrsDataService } from '../frs-data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-restaurant-add',
  templateUrl: './restaurant-add.component.html',
  styleUrls: ['./restaurant-add.component.scss']
})
export class RestaurantAddComponent implements OnInit {

  public stepIndex: number = 0;
  public restId: number;
  public restName: string;
  public email: string;
  public password: string;
  public code: number = 91;
  public number: string;
  public restSpeciality: string;
  public streetNo: string;
  public locality: string;
  public city: string;
  public state: string;
  public pincode: number;
  public rating = 5;

  constructor(public frsService: FrsDataService, public toastr: ToastrService) { }

  ngOnInit(): void {
  }

  controlSteps(pageName: string) {
      switch(pageName) {
        case 'page1':
          this.stepIndex = 0;
          break;
        case 'page2':
          this.stepIndex = 1;
          break;
        case 'register':
          // call backend
          let object = {
            "restId": this.restId,
            "restName": this.restName,
            "email": this.email,
            "password": this.password,
            "phoneNumber": this.number,
            "streetNo": this.streetNo,
            "city": this.city,
            "locality": this.locality,
            "state": this.state,
            "pincode": this.pincode,
            "speciality": this.restSpeciality,
            "rating": this.rating,
            "code": this.code,
            "number": this.number
          };

          this.frsService.createRestaurant(object).subscribe(
            data => {
              console.log(data);
              window.location.reload()
              this.toastr.success('Congrats!', 'Restaurant'+ object.restName+ 'Added successfully :)')
            },
            
            error => {
              console.log("Some error has occured"+JSON.stringify(error));
              this.toastr.error('The restaurant ID already exists.', 'Error')
            }
          )

          break;
        default:
          alert('Wow, this should not happen!');
      }
    }
}
