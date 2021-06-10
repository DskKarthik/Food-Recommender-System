import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { FrsDataService } from '../frs-data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public username: string;
  public password: string;
  public restId: number;
  public userData: any;
  public isRestaurantLogin: boolean = false;

  constructor(public frsService: FrsDataService, public router: Router, public toastr: ToastrService) { }

  ngOnInit(): void {
  }

  login() {

    document.getElementById('login-button').style.display = 'none';
    document.getElementById('load-login-button').style.display = 'block';

    if(this.isRestaurantLogin) {
      this.restaurantLogin();
    }
    else{
    let object = {
      "userName": this.username,
      "password": this.password
    }
    this.frsService.login(object).subscribe(
      data => {
        // this.userData =  data
        document.getElementById('login-button').style.display = 'block';
        document.getElementById('load-login-button').style.display = 'none';
        if(Object.keys(data).length == 1){
          this.toastr.error('Please check username and password again', 'Invalid Credentials')
        }
        else{
          
          sessionStorage.setItem('userDetails', JSON.stringify(data));
          this.frsService.postLoginActivities();
          let p = data.privelege
          if(p=="A")
          {
            this.router.navigateByUrl('/admin');
            this.toastr.success('Redirecting to Admin page..', 'Login Successful :)')
          }
          else
          {
            this.router.navigateByUrl('/home');
            this.toastr.success('Place your order now.', 'Login Successful :)')
          }

        }

      },
      
      error => {
        document.getElementById('login-button').style.display = 'block';
        document.getElementById('load-login-button').style.display = 'none';
        console.log("Some error has occured"+JSON.stringify(error));
      }
      )
    }
   
  }

  restaurantLogin() {
    document.getElementById('login-button').style.display = 'none';
    document.getElementById('load-login-button').style.display = 'block';
    let object = {
      "restId": this.restId,
      "password": this.password
    }

    this.frsService.restLogin(object).subscribe(
      data => {
        // this.userData =  data
        
        document.getElementById('login-button').style.display = 'block';
        document.getElementById('load-login-button').style.display = 'none';
        if(Object.keys(data).length == 1){
          alert('Invalid Credentials')
        }
        else{
          this.toastr.success('Redirecting to Restaurant page..', 'Login Successful :)')
          sessionStorage.setItem('restDetails', JSON.stringify(data));
          this.frsService.postLoginActivities();
          this.router.navigateByUrl('/restaurant-admin')

        }

      },
      
      error => {
        document.getElementById('login-button').style.display = 'block';
        document.getElementById('load-login-button').style.display = 'none';
        console.log("Some error has occured"+JSON.stringify(error));
      }
      )

  }

  showRestLogin(){
    this.isRestaurantLogin = true;
  }
  showUserLogin() {
    this.isRestaurantLogin = false;
  }

}
