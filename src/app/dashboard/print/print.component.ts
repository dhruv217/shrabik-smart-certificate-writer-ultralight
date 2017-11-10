import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MatSort, MatSidenav, MatSnackBar } from '@angular/material';
import { Student } from '../../shared/student';
import { StudentsDataSource } from '../../shared/students-datasource';
import 'rxjs/add/operator/take';
import {BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NFC, TAG_ISO_14443_3, TAG_ISO_14443_4, KEY_TYPE_A, KEY_TYPE_B } from 'nfc-pcsc';
declare const Buffer;
import * as firebase from 'firebase';


@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css'],
  providers: [StudentsDataSource]
})

export class PrintComponent implements OnInit, AfterViewInit, OnDestroy {

  students: Student[] = [];
  studentsRef;
  contentLoading: boolean;
  subs: Subscription[] = [];
  displayedColumns = ['serialNumber', 'name', 'print'];
  students$: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  serialNumber$: BehaviorSubject<string | null>;
  readers: Array<any> = [];
  card: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSidenav) sidenav: MatSidenav;

  constructor(public fireDb: AngularFireDatabase, public snackBar: MatSnackBar, public dataSource: StudentsDataSource) {
    this.contentLoading = true;
    this.studentsRef = fireDb.list('students');
    this.serialNumber$ = new BehaviorSubject(null);
    this.students$ = this.serialNumber$.switchMap(serialNumber =>
      fireDb.list('/students', ref =>
        serialNumber ? ref.orderByChild('serialNumber').equalTo(serialNumber).limitToFirst(1) : ref
      ).snapshotChanges()
    );
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

  ngAfterViewInit() {
    const nfc = new NFC();
    nfc.on('reader', async reader => {
      console.log('Reader Found :', reader.name);
      this.readers.push(reader);
      reader.aid = 'F222222222';
      reader.on('card', async card => {
        // standard nfc tags like Mifare
        if (card.type === TAG_ISO_14443_3) {
          // const uid = card.uid;
          console.log(`card detected`, { reader: reader.name, card });
          this.card = card;
        }else if (card.type === TAG_ISO_14443_4) {
          // Android HCE
          // process raw Buffer data
          const data = card.data.toString('utf8');
          console.log(`card detected`, { reader: reader.name, card: { ...card, data } });
          this.card = card;
        }else {
          // not possible, just to be sure
          console.log(`card detected`, { reader: reader.name, card });
        }
      });
    });
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  writeDataToCard(studentData) {
    const reader = this.readers[0];
    console.log('data', studentData);
    console.log(reader.name);
    const dataBuffer: any = Buffer.allocUnsafe(16);
    let studentKey: any;
    // subscribe to changes
    this.serialNumber$.next(studentData.serialNumber);
    this.students$.subscribe(studentObject => {
      console.log(studentObject);
      if (this.card !== undefined) {
        try {
          const key = 'D3B09FD9';
          const keyType = KEY_TYPE_B; // KEY_TYPE_A
          dataBuffer.fill(0);
          dataBuffer.write(studentData.serialNumber);
          studentKey = studentObject[0].key;
          Promise.all([
            // reader.authenticate(4, keyType, key),
            reader.write(4, dataBuffer, 16),
            // you add more authenticate call if you want auth more blocks
          ])
            .then(() => {
              this.card = undefined;
              const snackBarRefence = this.snackBar.open('Certificate successfully printed, Please remove.');
              console.log('write promise resolved');
            })
            .then(() => {
            this.studentsRef.update(studentKey, {
              printed: true,
            });
            console.log('data changed');
            })
            .catch(err => {
              console.log(`error`, err);
            });
        } catch (err) {
          console.error(`error when writing data`, { reader: reader.name, err });
        }
      } else {
        if (studentObject[0].key !== studentKey) {
          const snackBarRef = this.snackBar.open('No Card Inserted');
        }
      }
    });

  }


}
