import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { DataService } from '../_services/data.service';
import { MsFaceApiService } from '../_services/ms-face-api.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit, OnDestroy {
  @ViewChild('video') videoElm: ElementRef;
  @ViewChild('canvas') canvasElm: ElementRef;
  @ViewChild('employeeId') employeeId: ElementRef;

  name: string;
  captureData: string;
  private isCameraActive = false;
  verification_result = null;

  showCameraPreview = false;
  showInput = true;

  showWelcome = false;
  showGoodbye = false;

  readonly medias: MediaStreamConstraints = {
    audio: false,
    video: {
      facingMode: 'user'
    }
  };

  constructor(
    private dataService: DataService,
    private faceApi: MsFaceApiService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    if (this.isCameraActive) {
      this.stopCamera();
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 5000
    });
  }

  async detectEmployee(action: string) {
    if (
      !this.employeeId.nativeElement.value ||
      isNaN(this.employeeId.nativeElement.value)
    ) {
      this.openSnackBar(
        'ID is mandatory, if you do not know one, please ask your supervisor'
      );
    } else {
      const employee_id = +this.employeeId.nativeElement.value;
      await this.dataService.getEmployee(employee_id).subscribe(
        employee => {
          this.startCamera();
          this.showCameraPreview = !this.showCameraPreview;
          this.showInput = !this.showInput;

          setTimeout(() => {
            // Get image from Camera
            this.captureData = this.draw();

            this.stopCamera();
            this.showCameraPreview = !this.showCameraPreview;

            // Create Blob data
            const blob = this.dataService.createBlob(
              this.captureData.replace('data:image/png;base64,', ''),
              'image/png'
            );

            // Push to server
            this.faceApi.detectPerson(blob).subscribe(
              detected_person => {
                if (detected_person.length > 0) {
                  const faceId = detected_person[0].faceId;
                  this.faceApi
                    .verifyPerson(
                      faceId,
                      employee.personGroupId,
                      employee.personId
                    )
                    .subscribe(
                      verification_result => {
                        if (
                          verification_result.isIdentical
                          // verification_result.isIdentical &&
                          // verification_result.confidence >= 0.8
                        ) {
                          action === 'Check-In'
                            ? this.welcome(employee_id)
                            : this.goodbye(employee_id);
                        } else {
                          this.openSnackBar(
                            employee.firstName +
                              ', we can not recognize your face, please try again...'
                          );
                          this.showInput = true;
                        }
                      },
                      error => console.log(error.error.message)
                    );
                } else {
                  this.openSnackBar(
                    employee.firstName +
                      ', we can not recognize your face, please try again...'
                  );
                  this.showInput = true;
                }
              },
              () => {
                this.openSnackBar(
                  employee.firstName +
                    ', we can not recognize your face, please try again...'
                );
                this.showInput = true;
              }
            );
          }, 3000);
        },
        () => {
          this.openSnackBar(
            'We can not recognize your ID, please enter correct one and try again...'
          );
        }
      );
    }
  }

  welcome(employeeId: number) {
    this.showWelcome = true;
    this.showInput = false;
    setTimeout(() => {
      this.showWelcome = false;
      this.showInput = true;

      // Geolocation API
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.dataService.createEvent(1, position, employeeId).subscribe();
          },
          err => console.log(err),
          options
        );
      }
    }, 3000);
  }

  goodbye(employeeId: number) {
    this.showGoodbye = true;
    this.showInput = false;

    setTimeout(() => {
      this.showGoodbye = false;
      this.showInput = true;

      // Geolocation API
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.dataService.createEvent(2, position, employeeId).subscribe();
          },
          err => console.log(err),
          options
        );
      }
    }, 3000);
  }

  private startCamera() {
    window.navigator.mediaDevices
      .getUserMedia(this.medias)
      .then(stream => {
        this.videoElm.nativeElement.srcObject = stream;
        this.isCameraActive = true;
      })
      .catch(err => console.log(err));
  }

  private stopCamera() {
    this.videoElm.nativeElement.pause();
    if (this.videoElm.nativeElement.srcObject !== null) {
      const track = this.videoElm.nativeElement.srcObject.getTracks()[0] as MediaStreamTrack;
      track.stop();
    }

    this.isCameraActive = false;
  }

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
}
