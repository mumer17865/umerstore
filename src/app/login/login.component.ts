import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{
  uname: string | undefined;
  pass: string | undefined;
  cartService: any;

  constructor(private router: Router) {}

  login() {
    axios.post('http://localhost:3000/auth/login', {
      uname: this.uname,
      pass: this.pass
    })
    .then((response) => {
      if (response.data.success) {
        sessionStorage.setItem('token', response.data.token);
        this.router.navigate(['./dashboard']);
      } else {
        alert('Username or password is incorrect');
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }


  registerUser() {
    this.router.navigate(['/registeruser']);
  }
}

