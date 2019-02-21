import { Component, OnInit, Input } from '@angular/core';
import { FileService } from 'src/app/_services/file.service';

@Component({
  selector: 'app-checkin-image',
  templateUrl: './checkin-image.component.html',
  styleUrls: ['./checkin-image.component.scss']
})
export class CheckinImageComponent implements OnInit {
  CheckinImageBlobUrl = null;

  @Input() file_id: number;

  constructor(private fileService: FileService) {}

  ngOnInit() {
    this.getCheckinImage();
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.CheckinImageBlobUrl = reader.result;
      },
      false
    );
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getCheckinImage() {
    this.fileService.getFile(this.file_id).subscribe((blob: Blob) => {
      if (blob.size > 27) {
        this.createImageFromBlob(blob);
      }
    });
  }
}
