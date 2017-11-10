import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Upload } from '../add-student-dialog/upload';
import { AngularFireModule } from 'angularfire2';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as XLSX from 'ts-xlsx';
import * as firebase from 'firebase';

type AOA = Array<Array<any>>;

@Component({
  selector: 'app-add-multiple-student-dialog',
  templateUrl: './add-multiple-student-dialog.component.html',
  styleUrls: ['./add-multiple-student-dialog.component.css']
})
export class AddMultipleStudentDialogComponent implements OnInit {

  xlsxWorkBook: XLSX.IWorkBook;
  uploadXlsxProgressValue: number = -1;
  uploadPdfProgressValue: number = -1;
  @ViewChild('certPdfInput') certPdfInput;
  @ViewChild('studentInfoXlsxInput') studentInfoXlsxInput;
  primaryActionDisabled$ = new BehaviorSubject<boolean>(true); // disabled by default


  constructor(
    public dialogRef: MatDialogRef<AddMultipleStudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onPdfInput(el) {
    // Create a root reference
    const storageRef = firebase.storage().ref();
    console.log(this.certPdfInput.nativeElement.files[0].name);
    const pdfFile = this.certPdfInput.nativeElement.files[0];
    let uploadTask = storageRef.child(`upload/studentCertificatePdf/${pdfFile.name}`).put(pdfFile);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // upload in progress
        let snapshotRef = snapshot as firebase.storage.UploadTaskSnapshot;
        let bytesTransferred = (snapshotRef).bytesTransferred;
        let totalBytes = (snapshotRef).totalBytes;
        this.uploadPdfProgressValue = (bytesTransferred / totalBytes) * 100;
      },
      (error) => {
        // upload failed
        console.log(error);
      },
      () => {
        // upload success
        this.uploadPdfProgressValue = -1;
        this.primaryActionDisabled$.next(false);
        this.data.certPath = uploadTask.snapshot.downloadURL;
      }
    );
  }
  onXlsxInput(evt: any) {
    const xlsxFile = this.studentInfoXlsxInput.nativeElement.files[0];
    this.data.students = XLSX.utils.sheet_to_json(this.xlsxWorkBook)['Sheet1'];
    console.log(this.data.students);
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    // tslint:disable-next-line:curly
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.IWorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.IWorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data.students = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      console.log(this.data.students);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  ngOnInit() {
  }

}
