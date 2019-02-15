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
import { MsFaceApiService } from 'src/app/_services/ms-face-api.service';
import { EmployeeService } from 'src/app/_services/employee.service';
import { FileService } from 'src/app/_services/file.service';
import { ProjectService } from 'src/app/_services/project.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  EmployeeimageBlobUrl = null;

  projects = null;

  @ViewChild('video') videoElm: ElementRef;
  @ViewChild('canvas') canvasElm: ElementRef;
  showCameraPreview = false;
  captureData: string;
  isCameraActive = false;
  isLoading = false;

  readonly medias: MediaStreamConstraints = {
    audio: false,
    video: {
      facingMode: 'user'
    }
  };

  constructor(
    private employeeService: EmployeeService,
    private fileService: FileService,
    private projectService: ProjectService,
    private faceApi: MsFaceApiService,
    public dialogRef: MatDialogRef<EmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public employee: any
  ) {}

  ngOnInit() {
    this.getProjects();
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
        ]),
        inputProjectId: new FormControl(this.employee.projectId, [
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
        inputMobilePhone: new FormControl(null, [Validators.required]),
        inputProjectId: new FormControl(null, [Validators.required])
      });
    }
  }

  onSave() {
    const changedEmployee: Employee = new Employee(
      this.employeeForm.get('inputFirstName').value,
      this.employeeForm.get('inputLastName').value,
      this.employeeForm.get('inputPersonalId').value,
      this.employeeForm.get('inputBirthDate').value,
      this.employeeForm.get('inputMobilePhone').value,
      this.employeeForm.get('inputProjectId').value
    );
    this.isLoading = true;
    if (this.employee) {
      this.employeeService
        .editEmployee(this.employee.id, changedEmployee)
        .subscribe(
          () => {
            this.isLoading = false;
            this.dialogRef.close();
          },
          err => {
            this.isLoading = false;
            console.log(err.error);
          }
        );
    } else {
      this.employeeService.addNewEmployee(changedEmployee).subscribe(
        employee => {
          this.faceApi
            .addPersonToPersonGroup(
              employee.personGroupId,
              employee.firstName + ' ' + employee.lastName
            )
            .subscribe(
              person => {
                this.employeeService
                  .addPersonIdToEmployee(employee.id, person.personId)
                  .subscribe(
                    () => {
                      this.isLoading = false;
                      this.dialogRef.close();
                    },
                    err => {
                      console.log(err.error);
                      this.isLoading = false;
                    }
                  );
              },
              err => {
                console.log(
                  err.error.error.code + ': ' + err.error.error.message
                );
                this.isLoading = false;
              }
            );
        },
        err => {
          console.log(err.error);
          this.isLoading = false;
        }
      );
    }
  }

  onDelete() {
    this.isLoading = true;
    if (this.employee.employeePhotoFileId) {
      this.fileService.deleteFile(this.employee.employeePhotoFileId).subscribe(
        () => {
          this.faceApi
            .deletePersonFromPersonGroup(
              this.employee.personGroupId,
              this.employee.personId
            )
            .subscribe(
              () => {
                this.employeeService.removeEmployee(this.employee.id).subscribe(
                  () => {
                    this.isLoading = false;
                    this.dialogRef.close();
                  },
                  err => {
                    console.log(err.error);
                    this.isLoading = false;
                  }
                );
              },
              err => {
                console.log(
                  err.error.error.code + ': ' + err.error.error.message
                );
                this.isLoading = false;
              }
            );
        },
        err => {
          console.log(err.error);
          this.isLoading = false;
        }
      );
    } else {
      this.faceApi
        .deletePersonFromPersonGroup(
          this.employee.personGroupId,
          this.employee.personId
        )
        .subscribe(
          () => {
            this.employeeService.removeEmployee(this.employee.id).subscribe(
              () => {
                this.dialogRef.close();
                this.isLoading = false;
              },
              err => {
                console.log(err.error);
                this.isLoading = false;
              }
            );
          },
          err => {
            console.log(err.error.error.code + ': ' + err.error.error.message);
            this.isLoading = false;
          }
        );
    }
  }

  getEmployeePhoto(employee_id: number) {
    this.employeeService.getEmployee(employee_id).subscribe(
      employee => {
        if (+employee.employeePhotoFileId) {
          this.fileService.getFile(+employee.employeePhotoFileId).subscribe(
            (blob: Blob) => {
              if (blob.size > 27) {
                this.createImageFromBlob(blob);
              }
            },
            err => console.log(err.error)
          );
        }
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

  async takePhoto() {
    // Start camera and show preview
    if (!this.isCameraActive) {
      await this.startCamera();
      this.showCameraPreview = !this.showCameraPreview;
    } else {
      // capture image and process it
      if (this.employee) {
        const employee_id = this.employee.id;
        const employeePhotoFileId = this.employee.employeePhotoFileId;
        const personGroupId = this.employee.personGroupId;
        const personId = this.employee.personId;
        const persistedFaceId = this.employee.persistedFaceId;

        // Get image from Camera
        this.captureData = this.draw();
        await this.stopCamera();
        this.showCameraPreview = !this.showCameraPreview;
        this.isLoading = true;

        // Create Form Data
        const blob = await this.fileService.createBlob(
          this.captureData.replace('data:image/png;base64,', ''),
          'image/png'
        );
        const formData = await new FormData();
        await formData.append('file', blob);

        this.faceApi.addFaceToPerson(blob, personGroupId, personId).subscribe(
          resultOfaddFaceToPerson => {
            this.fileService.uploadFile(formData).subscribe(file_id => {
              this.employeeService
                .linkPhotoWithPerson(employee_id, file_id)
                .subscribe(() => {
                  this.employeeService
                    .addPersistedFaceIdtoEmployee(
                      employee_id,
                      resultOfaddFaceToPerson.persistedFaceId
                    )
                    .subscribe(() => {
                      if (employeePhotoFileId) {
                        this.fileService
                          .deleteFile(employeePhotoFileId)
                          .subscribe();
                      }
                      if (persistedFaceId) {
                        this.faceApi
                          .deleteFaceOfAPerson(
                            personGroupId,
                            personId,
                            persistedFaceId
                          )
                          .subscribe();
                      }
                      this.getEmployeePhoto(employee_id);
                      this.isLoading = false;
                    });
                });
            });
          },
          err => {
            console.log(err.error.error.code + ': ' + err.error.error.message);
            this.isLoading = false;
          }
        );
      }
    }
  }

  getProjects() {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
    });
  }
}
