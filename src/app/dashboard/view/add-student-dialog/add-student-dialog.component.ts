import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Upload } from './upload';
import { AngularFireModule } from 'angularfire2';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import * as firebase from 'firebase';

// declare var firebase: any;

@Component({
  selector: 'app-add-student-dialog',
  templateUrl: './add-student-dialog.component.html',
  styleUrls: ['./add-student-dialog.component.css']
})
export class AddStudentDialogComponent implements OnInit {

  uploadProgressValue: number = -1;
  @ViewChild('certPdfInput') certPdfInput;
  primaryActionDisabled$ = new BehaviorSubject<boolean>(true); // disabled by default

  constructor(
    public dialogRef: MatDialogRef<AddStudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFileInput(el) {
    // Create a root reference
    const storageRef = firebase.storage().ref();
    console.log(this.certPdfInput.nativeElement.files[0].name);
    const pdfFile = this.certPdfInput.nativeElement.files[0];
    let uploadTask = storageRef.child(`upload/studentCertificatePdf/${pdfFile.name}`).put(pdfFile);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        let snapshotRef = snapshot as firebase.storage.UploadTaskSnapshot;
        let bytesTransferred = (snapshotRef).bytesTransferred;
        let totalBytes = (snapshotRef).totalBytes;
        this.uploadProgressValue = (bytesTransferred / totalBytes) * 100;
      },
      (error) => {
        // upload failed
        console.log(error);
      },
      () => {
        // upload success
        this.uploadProgressValue = -1;
        this.primaryActionDisabled$.next(false);
        this.data.certPath = uploadTask.snapshot.downloadURL;
      }
    );
  }

  ngOnInit() {
  }

}
