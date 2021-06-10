import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StarRatingComponent} from '../star-rating/star-rating.component';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    StarRatingComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    FlexLayoutModule
  ],
  exports: [
    StarRatingComponent,
    MatIconModule,
    MatCardModule,
    FlexLayoutModule
  ]
})
export class StarRatingModule { }
