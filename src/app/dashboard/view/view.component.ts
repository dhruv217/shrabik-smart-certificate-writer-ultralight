import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSort } from '@angular/material';
import { AddStudentDialogComponent } from './add-student-dialog/add-student-dialog.component';
import { AddMultipleStudentDialogComponent } from './add-multiple-student-dialog/add-multiple-student-dialog.component';
import { Student } from '../../shared/student';
import { StudentsDataSource } from '../../shared/students-datasource';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  providers: [StudentsDataSource]
})
export class ViewComponent implements OnDestroy, OnInit {

  students: Observable<any>;
  studentsRef;
  contentLoading: boolean;
  subs: Subscription[] = [];
  displayedColumns = ['serialNumber', 'name', 'status'];
  selectedRowIndex = -1;
  selectedCertificatePath: string;
  selectedPageInPdf: number;

  @ViewChild(MatSort) sort: MatSort;


  constructor(db: AngularFireDatabase, public dialog: MatDialog, public dataSource: StudentsDataSource, public sanitizer: DomSanitizer) {
    this.contentLoading = true;
    this.studentsRef = db.list('students');
  }

  ngOnInit() {
    const _that = this;
          // simply handles hiding the AJAX Loader
      this.dataSource.connect().take(1).subscribe(data => {
        this.contentLoading = false;
      });
      this.subs.push(this.sort.sortChange.subscribe(() => {
        _that.dataSource.sort = {
          field: _that.sort.active,
          direction: _that.sort.direction
        };
      }));
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  addStudentData(): void {
    const addStudentDialogRef = this.dialog.open(AddStudentDialogComponent, {
      width: '330px',
      data: {serialNo: '', name: '', certPath: ''},
    });

    addStudentDialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      this.studentsRef.push({
        serialNumber: result.serialNo,
        name: result.name,
        certificatePath: result.certPath,
        printed: false
      });
    });

  }

  addMultipleStudentData() {
    const addMultipleDialogRef = this.dialog.open(AddMultipleStudentDialogComponent, {
      width: '330px',
      data: { students: [], certPath: '' }
    });

    addMultipleDialogRef.afterClosed().subscribe(result => {
      result.students.splice(0, 1);
      result.students.forEach(student => {
        console.log(student[0]);
        this.studentsRef.push({
          serialNumber: student[0],
          name: student[1],
          certificatePath: result.certPath,
          pageInPdf: student[2],
          printed: false
        });
      });
    });
  }

  selectRow(row) {
    this.selectedRowIndex = row.serialNumber;
    this.selectedCertificatePath = row.certificatePath;
    this.selectedPageInPdf = (row.pageInPdf === undefined) ? 1 : row.pageInPdf;
  }
}
