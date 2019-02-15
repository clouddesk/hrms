import { Component, OnInit, Input } from '@angular/core';
import { FileService } from 'src/app/_services/file.service';

@Component({
  selector: 'app-employee-photo',
  templateUrl: './employee-photo.component.html',
  styleUrls: ['./employee-photo.component.scss']
})
export class EmployeePhotoComponent implements OnInit {
  EmployeeimageBlobUrl = null;

  @Input() employee;

  constructor(private fileService: FileService) {}

  ngOnInit() {
    if (+this.employee.employeePhotoFileId) {
      this.fileService.getFile(+this.employee.employeePhotoFileId).subscribe(
        (blob: Blob) => {
          if (blob.size > 27) {
            this.createImageFromBlob(blob);
          }
        },
        err => console.log(err.error)
      );
    }
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.EmployeeimageBlobUrl = reader.result;
      },
      false
    );
    if (image) {
      reader.readAsDataURL(image);
    }
  }
}
