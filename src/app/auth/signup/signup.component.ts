import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { moveIn, fallIn } from '../../router.animations';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [AngularFireAuth],
  animations: [moveIn(), fallIn()],
  // tslint:disable-next-line:use-host-property-decorator
  host: {'[@moveIn]': ''}
})
export class SignupComponent implements OnInit {

  state: string = '';
  error: any;

  constructor(private firebaseAuth: AngularFireAuth, private router: Router) { }

  onSubmit(formData) {
    if (formData.valid) {
      this.firebaseAuth
        .auth
        .createUserWithEmailAndPassword(formData.value.email, formData.value.password)
        .then(value => {
          // console.log('Success!', value);
          this.router.navigate(['/login']);
        })
        .catch(err => {
          console.log('Something went wrong:', err.message);
          this.error = err;
        });
    }
  }

  ngOnInit() {
  }

}
