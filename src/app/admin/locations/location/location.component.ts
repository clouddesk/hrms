import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from '../../../_services/data.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  locationForm: FormGroup;

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit() {
    const newLocation = {
      locationName: this.locationForm.value.inputLocationName,
      locationAddress: this.locationForm.value.inputLocationAddress,
      locationPosition: {
        longitude: this.locationForm.value.inputLocationPositionLongitude,
        latitude: this.locationForm.value.inputLocationPositionLatitude
      }
    };
    this.dataService
      .addLocation(newLocation)
      .subscribe(() =>
        this.router.navigate(['.'], { relativeTo: this.route.parent })
      );
  }

  ngOnInit() {
    this.locationForm = new FormGroup({
      inputLocationName: new FormControl(null, Validators.required),
      inputLocationAddress: new FormControl(null, Validators.required),
      inputLocationPositionLongitude: new FormControl(
        null,
        Validators.required
      ),
      inputLocationPositionLatitude: new FormControl(null, Validators.required)
    });
  }

  getLocation() {
    // Geolocation API
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.locationForm.patchValue({inputLocationPositionLongitude: position.coords.longitude});
          this.locationForm.patchValue({inputLocationPositionLatitude: position.coords.latitude});
        },
        err => console.log(err),
        options
      );
    }
  }
}
