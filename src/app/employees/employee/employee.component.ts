import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Employee } from 'src/app/models/employee';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/_services/data.service';
import { MsFaceApiService } from 'src/app/_services/ms-face-api.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  EmployeeimageBlobUrl = null;

  @ViewChild('video') videoElm: ElementRef;
  @ViewChild('canvas') canvasElm: ElementRef;
  showCameraPreview = false;
  captureData: string;
  isCameraActive = false;
  isLoadingResults = true;

  readonly medias: MediaStreamConstraints = {
    audio: false,
    video: {
      facingMode: 'user'
    }
  };

  constructor(
    private dataService: DataService,
    private faceApi: MsFaceApiService,
    public dialogRef: MatDialogRef<EmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public employee: any
  ) {}

  ngOnInit() {
    if (this.employee) {
      this.employeeForm = new FormGroup({
        inputFirstName: new FormControl(this.employee.firstName, [
          Validators.required
        ]),
        inputLastName: new FormControl(this.employee.lastName, [
          Validators.required
        ]),
        inputPersonalId: new FormControl(this.employee.personalId, [
          Validators.required,
          Validators.minLength(11)
        ]),
        inputBirthDate: new FormControl(this.employee.birthDate, [
          Validators.required
        ]),
        inputMobilePhone: new FormControl(this.employee.mobilePhone, [
          Validators.required
        ])
      });
      this.getEmployeePhoto(this.employee.id);
    } else {
      this.employeeForm = new FormGroup({
        inputFirstName: new FormControl(null, [Validators.required]),
        inputLastName: new FormControl(null, [Validators.required]),
        inputPersonalId: new FormControl(null, [
          Validators.required,
          Validators.minLength(11)
        ]),
        inputBirthDate: new FormControl(null, [Validators.required]),
        inputMobilePhone: new FormControl(null, [Validators.required])
      });
    }
  }

  onSave() {
    const changedEmployee: Employee = new Employee(
      this.employeeForm.get('inputFirstName').value,
      this.employeeForm.get('inputLastName').value,
      this.employeeForm.get('inputPersonalId').value,
      this.employeeForm.get('inputBirthDate').value,
      this.employeeForm.get('inputMobilePhone').value
    );
    if (this.employee) {
      this.dataService
        .editEmployee(this.employee.id, changedEmployee)
        .subscribe(
          () => {
            this.dialogRef.close();
          },
          err => console.log(err.error)
        );
    } else {
      this.dataService.addNewEmployee(changedEmployee).subscribe(
        employee => {
          this.dialogRef.close();
          this.faceApi
            .addPersonToPersonGroup(
              employee.personGroupId,
              employee.firstName + ' ' + employee.lastName
            )
            .subscribe(
              person => {
                this.dataService
                  .addPersonIdToEmployee(employee.id, person.personId)
                  .subscribe(
                    () => {
                    },
                    err => console.log(err.error)
                  );
              },
              err =>
                console.log(
                  err.error.error.code + ': ' + err.error.error.message
                )
            );
        },
        err => console.log(err.error)
      );
    }
  }

  onDelete() {
    if (this.employee.employeePhotoFileId) {
      this.dataService.deleteFile(this.employee.employeePhotoFileId).subscribe(
        () => {
          this.faceApi
            .deletePersonFromPersonGroup(
              this.employee.personGroupId,
              this.employee.personId
            )
            .subscribe(
              () => {
                this.dataService.removeEmployee(this.employee.id).subscribe(
                  () => {
                    this.dialogRef.close();
                  },
                  err => console.log(err.error)
                );
              },
              err =>
                console.log(
                  err.error.error.code + ': ' + err.error.error.message
                )
            );
        },
        err => console.log(err.error)
      );
    } else {
      this.faceApi
        .deletePersonFromPersonGroup(
          this.employee.personGroupId,
          this.employee.personId
        )
        .subscribe(
          () => {
            this.dataService.removeEmployee(this.employee.id).subscribe(
              () => {
                this.dialogRef.close();
              },
              err => console.log(err.error)
            );
          },
          err =>
            console.log(err.error.error.code + ': ' + err.error.error.message)
        );
    }
  }

  getEmployeePhoto(employee_id: number) {
    this.dataService.getEmployee(employee_id).subscribe(
      employee => {
        this.dataService.getFile(+employee.employeePhotoFileId).subscribe(
          (blob: Blob) => {
            if (blob.size > 27) {
              this.createImageFromBlob(blob);
            }
          },
          err => console.log(err.error)
        );
      },
      err => console.log(err.error)
    );
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

  takePhoto() {
    if (this.employee) {
      const employee_id = this.employee.id;
      const employeePhotoFileId = this.employee.employeePhotoFileId;
      const personGroupId = this.employee.personGroupId;
      const personId = this.employee.personId;
      const persistedFaceId = this.employee.persistedFaceId;

      console.log(
        employee_id,
        employeePhotoFileId,
        personGroupId,
        personId,
        persistedFaceId
      );

      this.startCamera();
      this.showCameraPreview = !this.showCameraPreview;

      setTimeout(() => {
        // Get image from Camera
        this.captureData = this.draw();
        this.stopCamera();
        this.showCameraPreview = !this.showCameraPreview;

        // Create Form Data
        const blob = this.createBlob(
          this.captureData.replace('data:image/png;base64,', ''),
          'image/png'
        );
        const formData = new FormData();
        formData.append('file', blob);

        // Push blob file to database
        this.dataService.uploadFile(formData).subscribe(
          file_id => {
            // After upload of new file delete old file if such exists
            if (employeePhotoFileId) {
              this.dataService
                .deleteFile(employeePhotoFileId)
                .subscribe(() => {}, err => console.log(err.error));
            }
            // Link new file with employee
            this.dataService
              .linkPhotoWithPerson(employee_id, file_id)
              .subscribe(
                () => {
                  // upload new file to FaceAPI
                  this.faceApi
                    .addFaceToPerson(blob, personGroupId, personId)
                    .subscribe(
                      resultOfaddFaceToPerson => {
                        if (persistedFaceId) {
                          // If upload succseeded and old persisted ID exists then delete old persisted ID
                          this.faceApi
                            .deleteFaceOfAPerson(
                              personGroupId,
                              personId,
                              persistedFaceId
                            )
                            .subscribe(
                              () => {
                                // Add new persisted ID to employee in database
                                this.dataService
                                  .addPersistedFaceIdtoEmployee(
                                    employee_id,
                                    resultOfaddFaceToPerson.persistedFaceId
                                  )
                                  .subscribe(
                                    () => {
                                      // show new photo on the screen
                                      this.getEmployeePhoto(employee_id);
                                    },
                                    err => console.log(err.error)
                                  );
                              },
                              err =>
                                console.log(
                                  err.error.error.code +
                                    ': ' +
                                    err.error.error.message
                                )
                            );
                        } else {
                          // Add new persisted ID to employee in database
                          this.dataService
                            .addPersistedFaceIdtoEmployee(
                              employee_id,
                              resultOfaddFaceToPerson.persistedFaceId
                            )
                            .subscribe(
                              () => {
                                // show new photo on the screen
                                this.getEmployeePhoto(employee_id);
                              },
                              err => console.log(err.error)
                            );
                        }
                      },
                      err => {
                        console.log(
                          err.error.error.code + ': ' + err.error.error.message
                        );
                        if (persistedFaceId) {
                          // Remove persisted ID from faceAPI
                          this.faceApi
                            .deleteFaceOfAPerson(
                              personGroupId,
                              personId,
                              persistedFaceId
                            )
                            .subscribe(
                              () => {
                                // Remove persisted ID from database
                                this.dataService
                                  .removePersistedFaceIdFromEmployee(
                                    employee_id
                                  )
                                  .subscribe(
                                    () => {
                                      // Remove employee photo from database
                                      this.dataService
                                        .deleteFile(file_id.id)
                                        .subscribe(
                                          () => {
                                            // Remove id of a file from employee in database
                                            this.dataService
                                              .unlinkPhotoFromPerson(
                                                employee_id
                                              )
                                              .subscribe(
                                                () =>
                                                  (this.EmployeeimageBlobUrl = null),
                                                errorUnlikingPhotoFromPerson =>
                                                  console.log(
                                                    errorUnlikingPhotoFromPerson.error
                                                  )
                                              );
                                          },
                                          errorDeletingFile =>
                                            console.log(errorDeletingFile.error)
                                        );
                                    },
                                    errorRemovingPeristedFaceIdFromEmployee =>
                                      console.log(
                                        errorRemovingPeristedFaceIdFromEmployee.error
                                      )
                                  );
                              },
                              errorDeletingFaceOfAPerson =>
                                console.log(
                                  errorDeletingFaceOfAPerson.error.error.code +
                                    ': ' +
                                    errorDeletingFaceOfAPerson.error.error
                                      .message
                                )
                            );
                        } else {
                          // Remove employee photo from database
                          console.log('file_id: ' + file_id.id);
                          this.dataService
                            .deleteFile(file_id.id)
                            .subscribe(() => {
                              // Remove id of a file from employee in database
                              this.dataService
                                .unlinkPhotoFromPerson(employee_id)
                                .subscribe(() => {
                                  this.EmployeeimageBlobUrl = null;
                                });
                            });
                        }
                      }
                    );
                },
                err => console.log(err.error)
              );
          },
          err => console.log(err.error)
        );
      }, 3000);
    }
  }
}
