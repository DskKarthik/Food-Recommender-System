import { Component, Input, OnInit } from '@angular/core';
import { FrsDataService } from '../frs-data.service';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit {

  @Input() config: any;
  @Input() rating: any;
  public enableClick: boolean = true;
  selectedRating = 0;
  stars = [
    {
      id: 1,
      icon: 'star',
      class: 'star-gray star-hover star'
    },
    {
      id: 2,
      icon: 'star',
      class: 'star-gray star-hover star'
    },
    {
      id: 3,
      icon: 'star',
      class: 'star-gray star-hover star'
    },
    {
      id: 4,
      icon: 'star',
      class: 'star-gray star-hover star'
    },
    {
      id: 5,
      icon: 'star',
      class: 'star-gray star-hover star'
    }

  ];

  constructor(public frsService: FrsDataService) {}

  ngOnInit(): void {
    console.log(this.rating);
    if(this.rating != null) {
      this.enableClick = false;
      this.selectStar(this.rating);
    }

  }


  selectStar(value): void{

    console.log(this.config);
    // prevent multiple selection
    if ( this.selectedRating === 0){

      this.stars.filter( (star) => {

        if ( star.id <= value){

          star.class = 'star-gold star';

        }else{

          star.class = 'star-gray star';

        }

        return star;
      });

    }

    this.selectedRating = value;
    this.config.ratingValue = this.selectedRating;

    this.frsService.updateDishRating(this.config).subscribe(
      data => {
      console.log(JSON.stringify(data))
      },
      
      error => {
        console.log("Some error has occured"+JSON.stringify(error));
      }
    )

  }


}
