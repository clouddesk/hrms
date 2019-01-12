import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { DataService } from '../_services/data.service';
import { MsFaceApiService } from '../_services/ms-face-api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit, OnDestroy {
  @ViewChild('video') videoElm: ElementRef;
  @ViewChild('canvas') canvasElm: ElementRef;
  name: string;
  captureData: string;
  private isCameraActive = false;

  showCameraPreview = false;

  readonly medias: MediaStreamConstraints = {
    audio: false,
    video: {
      facingMode: 'user'
    }
  };

  constructor(
    private dataService: DataService,
    private faceApi: MsFaceApiService
  ) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    this.stopCamera();
  }

  takePhotoAndUploadToServer(personName: HTMLInputElement, employee_id = 1, personGroupId = '1') {
    this.startCamera();
    this.showCameraPreview = !this.showCameraPreview;

    setTimeout(() => {
      // Get image from Camera
      this.captureData = this.draw();

      // Create Blob data
      this.captureData = this.captureData.replace('data:image/png;base64,', '');
      const contentType = 'image/png';
      const blob = this.createBlob(this.captureData, contentType);
      const formData = new FormData();
      formData.append('file', blob);

      // Push to server
      this.dataService.uploadFile(formData).subscribe(file_id => {
        this.stopCamera();
        this.showCameraPreview = !this.showCameraPreview;
        this.dataService
          .linkPhotoWithPerson(employee_id, file_id)
          .subscribe(() => {
            this.faceApi
              .addPersonToPersonGroup(personGroupId, personName.value)
              .subscribe(resultOfaddPersonToPersonGroup => {
                this.dataService
                  .addPersonIdToEmployee(
                    employee_id,
                    resultOfaddPersonToPersonGroup.personId
                  )
                  .subscribe(() => {
                    this.faceApi
                      .addFaceToPerson(
                        blob,
                        personGroupId,
                        resultOfaddPersonToPersonGroup.personId
                      )
                      .subscribe(resultOfaddFaceToPerson => {
                        console.log(
                          'persistentFaceId: ' +
                            resultOfaddFaceToPerson.persistedFaceId
                        );
                        this.dataService
                          .addPersistentFaceIdtoEmployee(
                            employee_id,
                            resultOfaddFaceToPerson.persistedFaceId
                          )
                          .subscribe();
                      });
                  });
              });
          });
      });
    }, 3000);
  }

  detectEmployee(employee_id = 1, personGroupId = '1') {
    this.startCamera();
    this.showCameraPreview = !this.showCameraPreview;

    setTimeout(() => {
      // Get image from Camera
      this.captureData = this.draw();

      this.stopCamera();
      this.showCameraPreview = !this.showCameraPreview;

      // Create Blob data
      this.captureData = this.captureData.replace('data:image/png;base64,', '');
      const contentType = 'image/png';
      const blob = this.createBlob(this.captureData, contentType);

      // Push to server
      this.faceApi.detectPerson(blob).subscribe(detected_person => {
        const faceId = detected_person[0].faceId;
        console.log(faceId);
        this.dataService.getEmployee(employee_id).subscribe(employee => {
          console.log(employee);
          this.faceApi
            .verifyPerson(
              faceId,
              personGroupId,
              employee.personId
            )
            .subscribe(verification_result => {
              console.log(verification_result);
            });
        });
      });
    }, 3000);
  }

  private startCamera() {
    console.log('starting camera...');

    window.navigator.mediaDevices
      .getUserMedia(this.medias)
      .then(stream => {
        this.videoElm.nativeElement.srcObject = stream;
        this.isCameraActive = true;
      })
      .catch(error => {
        console.error(error);
        alert(error);
      });
  }

  // onClickCamera() {
  //   if (this.isCameraActive) {
  //     this.captureData = this.draw();
  //     this.captureData = this.captureData.replace('data:image/png;base64,', '');

  //     this.stopCamera();
  //   } else {
  //     this.captureData = '';
  //     this.startCamera();
  //   }
  // }

  private stopCamera() {
    console.log('stopping camera...');

    this.videoElm.nativeElement.pause();
    if (this.videoElm.nativeElement.srcObject !== null) {
      const track = this.videoElm.nativeElement.srcObject.getTracks()[0] as MediaStreamTrack;
      track.stop();
    }

    this.isCameraActive = false;
  }

  // isGoodToRegister = () => {
  //   return this.captureData !== '' && this.name !== '';
  // };

  private draw() {
    const WIDTH = this.videoElm.nativeElement.clientWidth;
    const HEIGHT = this.videoElm.nativeElement.clientHeight;

    const ctx = this.canvasElm.nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    this.canvasElm.nativeElement.width = WIDTH;
    this.canvasElm.nativeElement.height = HEIGHT;

    return this.canvasElm.nativeElement.toDataURL(
      ctx.drawImage(this.videoElm.nativeElement, 0, 0, WIDTH, HEIGHT)
    );
  }

  private createBlob(imageBase64, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(imageBase64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  private createPersonGroup(
    personGroupId: HTMLInputElement,
    personGroupName: HTMLInputElement
  ) {
    this.faceApi
      .createPersonGroup(personGroupId.value, personGroupName.value)
      .subscribe(res => {
        console.log(res);
      });
  }

  private deletePersonGroup(personGroupId: HTMLInputElement) {
    this.faceApi
      .deletePersonGroup(personGroupId.value)
      .subscribe(res => console.log(res));
  }

  private trainPersonGroup(personGroupId: HTMLInputElement) {
    this.faceApi
      .trainPersonGroup(personGroupId.value)
      .subscribe(res => console.log(res));
  }

  private checkPersonGroupTrainingStatus(personGroupId: HTMLInputElement) {
    this.faceApi
      .checkPersonGroupTrainingStatus(personGroupId.value)
      .subscribe(res => console.log('Status: ' + res.status));
  }

  private getPersonGroups() {
    this.faceApi.listPersonGroups().subscribe(res => console.log(res));
  }

  private getPersonsOfPersonGroup() {
    const personGroupId = '1';
    this.faceApi
      .listPersonOfPersonGroup(personGroupId)
      .subscribe(persons => console.log(persons));
  }
}
