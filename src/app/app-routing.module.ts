import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { OrderComponent } from './order/order.component';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DishesComponent } from './dishes/dishes.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { AdminComponent } from './admin/admin.component';
import { RestaurantAddComponent } from './restaurant-add/restaurant-add.component';
import { DriverAddComponent } from './driver-add/driver-add.component';
import { AdminStatsComponent } from './admin-stats/admin-stats.component';
import { RestaurantAdminComponent } from './restaurant-admin/restaurant-admin.component';
import { DishAddComponent } from './dish-add/dish-add.component';
import { RestaurantStatsComponent } from './restaurant-stats/restaurant-stats.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TeamComponent } from './team/team.component';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { UserStatsComponent } from './user-stats/user-stats.component';

const routes: Routes = [
  {path: '', component: WelcomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: RegisterComponent},
  {path: 'order', component: OrderComponent},
  {path: 'restaurant/:restId', component: DishesComponent},
  {path: 'item-details/:dishId', component: ProductDetailsComponent},
  {path: 'cart', component: CartComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'restaurant-add', component: RestaurantAddComponent},
  {path: 'driver-add', component: DriverAddComponent},
  {path: 'admin-stats', component: AdminStatsComponent},
  {path: 'restaurant-admin', component: RestaurantAdminComponent},
  {path: 'dishes-add', component: DishAddComponent},
  {path: 'restaurant-stats', component: RestaurantStatsComponent},
  {path: 'user-profile', component: UserProfileComponent},
  {path: 'about-us', component: TeamComponent},
  {path: 'user-stats', component: UserStatsComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
