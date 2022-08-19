import { Component, OnInit } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl(
      '',
      Validators.compose([Validators.email, Validators.required])
    ),
    password: new FormControl('', Validators.required),
  });
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getAuthState().subscribe((user) => {
      if (user) {
        this.router.navigateByUrl('/books');
      }
    });
  }

  onSubmit() {
    const { email, password } = this.form.value;
    if (email && password) {
      this.authService
        .login(email, password)
        .then(() => {
          this.router.navigateByUrl('/books');
        })
        .catch((error: FirebaseError) => {
          //TODO エラーメッセージを出す
          console.log(error);
        });
    }
  }
}
