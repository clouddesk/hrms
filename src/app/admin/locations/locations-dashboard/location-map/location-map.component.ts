import { Component, OnInit, Input } from '@angular/core';
import { MapService } from 'src/app/_services/map.service';
import { FileService } from 'src/app/_services/file.service';

@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.component.html',
  styleUrls: ['./location-map.component.scss']
})
export class LocationMapComponent implements OnInit {
  mapImageBlobURL = null;

  @Input() position;

  constructor(private mapAPI: MapService, private fileService: FileService) {}

  ngOnInit() {
    this.getLocationMap();
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.mapImageBlobURL = reader.result;
      },
      false
    );
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getLocationMap() {
    const point = this.position.coordinates;
    return this.mapAPI
      .getLocationMap(point[1].toString(), point[0].toString())
      .subscribe(
        (data: string) => {
          const newData = this.fileService.createBlob(data, 'image/png');
          this.createImageFromBlob(newData);
        },
        err => console.log(err.error)
      );
  }
}
