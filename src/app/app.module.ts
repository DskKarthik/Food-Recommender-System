import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './welcome/welcome.component';
import {MatTabsModule} from '@angular/material/tabs';
import { FrsDataService } from './frs-data.service';
import { OrderComponent } from './order/order.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DishesComponent } from './dishes/dishes.component';
import { FormsModule } from '@angular/forms';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { AdminComponent } from './admin/admin.component';
import { RestaurantAddComponent } from './restaurant-add/restaurant-add.component';
import { DriverAddComponent } from './driver-add/driver-add.component';
import { AdminStatsComponent } from './admin-stats/admin-stats.component';
import { RestaurantAdminComponent } from './restaurant-admin/restaurant-admin.component';
import { DishAddComponent } from './dish-add/dish-add.component';
import { RestaurantStatsComponent } from './restaurant-stats/restaurant-stats.component';
import { HttpClientModule } from '@angular/common/http';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ToastrModule } from 'ngx-toastr';
import { TeamComponent } from './team/team.component';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { StarRatingModule } from './star-rating/star-rating.module';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    LoginComponent,
    RegisterComponent,
    WelcomeComponent,
    OrderComponent,
    NotFoundComponent,
    DishesComponent,
    ProductDetailsComponent,
    CartComponent,
    AdminComponent,
    RestaurantAddComponent,
    DriverAddComponent,
    AdminStatsComponent,
    RestaurantAdminComponent,
    DishAddComponent,
    RestaurantStatsComponent,
    UserProfileComponent,
    TeamComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    StarRatingModule
  ],
  providers: [FrsDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
