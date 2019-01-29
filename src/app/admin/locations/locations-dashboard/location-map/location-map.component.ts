import { Component, OnInit, Input } from '@angular/core';
import { GoogleMapsApiService } from 'src/app/_services/google-maps-api.service';

@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.component.html',
  styleUrls: ['./location-map.component.scss']
})
export class LocationMapComponent implements OnInit {
  MapImageBlobUrl = null;

  @Input() position;

  constructor(private mapAPI: GoogleMapsApiService) {}

  ngOnInit() {
    this.getLocationMap(this.position);
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.MapImageBlobUrl = reader.result;
      },
      false
    );
    if (image) {
      reader.readAsDataURL(image);
    }
  }
  getLocationMap(position) {
    const point = position.coordinates;
    return this.mapAPI
      .getLocationMap(point[1].toString(), point[0].toString())
      .subscribe(
        (blob: Blob) => {
          if (blob.size > 27) {
            this.createImageFromBlob(blob);
          }
        },
        err => console.log(err.error)
      );
  }
}
