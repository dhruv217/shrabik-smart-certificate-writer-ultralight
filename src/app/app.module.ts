import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatGridListModule,
  MatListModule,
  MatInputModule,
  MatSelectModule,
  MatProgressBarModule,
  MatDialogModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatTabsModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatTableModule
} from '@angular/material';
import 'hammerjs';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ViewComponent } from './dashboard/view/view.component';
import { PrintComponent } from './dashboard/print/print.component';

// Import the AngularFireModule and the AngularFireDatabaseModule
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AddStudentDialogComponent } from './dashboard/view/add-student-dialog/add-student-dialog.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './authguard.service';
import { routes } from './app.routes';
import { AddMultipleStudentDialogComponent } from './dashboard/view/add-multiple-student-dialog/add-multiple-student-dialog.component';

// Define the firebase database configuration keys, get it from your Firebase application console
export const firebaseConfig = {
    apiKey: 'AIzaSyA5cSfPy8QoErJTptdHxhcpBQlN4PogYTw',
    authDomain: 'shrabik-smart-certificate.firebaseapp.com',
    databaseURL: 'https://shrabik-smart-certificate.firebaseio.com',
    projectId: 'shrabik-smart-certificate',
    storageBucket: 'shrabik-smart-certificate.appspot.com',
    messagingSenderId: '296622038511'
  };

@NgModule({
  declarations: [
    AppComponent,
    ViewComponent,
    PrintComponent,
    AddStudentDialogComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    AddMultipleStudentDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatGridListModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatSidenavModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FlexLayoutModule,
    PdfViewerModule,
    routes
  ],
  providers: [AuthGuard],
  entryComponents: [AddStudentDialogComponent, AddMultipleStudentDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
