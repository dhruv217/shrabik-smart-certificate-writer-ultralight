import { FirebaseDataSource } from './firebase-datasource';
import { Student } from './student';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';


@Injectable()
export class StudentsDataSource extends FirebaseDataSource<Student> {
  constructor(
    protected db: AngularFireDatabase
  ) {
    super('/students', db);
  }
}
