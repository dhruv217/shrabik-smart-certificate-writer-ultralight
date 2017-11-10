import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { moveIn, fallIn } from '../../router.animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AngularFireAuth],
  animations: [moveIn(), fallIn()],
  host: {'[@moveIn]': ''}
})

export class LoginComponent implements OnInit {
    state: string = '';
    error: any;

  constructor(public firebaseAuth: AngularFireAuth, private router: Router) {
    this.firebaseAuth.authState.subscribe(authState => {
      if (authState) {
        this.router.navigateByUrl('/dashboard');
      }
    });
  }


  onSubmit(formData) {
    if (formData.valid) {
      console.log(formData);
      this.firebaseAuth.auth
        .signInWithEmailAndPassword(formData.value.email, formData.value.password)
        .then(value => {
          // console.log('Nice, it worked!', value);
          this.router.navigate(['/dashboard']);
        })
        .catch(err => {
          console.log('Something went wrong:', err.message);
          this.error = err.message;
        });
    }
  }

  ngOnInit() {
  }

}
