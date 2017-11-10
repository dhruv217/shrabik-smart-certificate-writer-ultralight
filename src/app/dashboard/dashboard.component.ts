import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { moveIn, fallIn, moveInLeft, moveInTop } from '../router.animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [AngularFireAuth],
  animations: [moveInTop()],
  // tslint:disable-next-line:use-host-property-decorator
  host: {'[@moveInTop]': ''}
})
export class DashboardComponent implements OnInit {
  state: string = '';

  constructor(public firebaseAuth: AngularFireAuth, private router: Router) { }

  ngOnInit() {
  }

  /* this.af.auth.subscribe(auth => {
    if(auth) {
      this.name = auth;
    }
  }); */

  logout() {
    this.firebaseAuth
      .auth
      .signOut();
    this.router.navigateByUrl('/login');
  }

}
