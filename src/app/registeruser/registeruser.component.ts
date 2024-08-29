import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import axios from 'axios';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registeruser',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registeruser.component.html',
  styleUrl: './registeruser.component.css'
})
export class RegisterUserComponent {
  name: any;
  email: any;
  uname: any;
  pass: any;
  rpass: any;
  
  constructor(private router: Router, private UserService: UserService, private http: HttpClient) { }



  inputDataIntoDatabase(){
    if(this.pass != this.rpass){
      alert('Password does not match');
      return;
    }
    let data = {
      name: this.name,
      email: this.email,
      uname: this.uname,
      pass: this.pass,
    };
    

    axios.post(`${this.UserService.apiUrl}/auth/register`, data)
    .then((response) => {
      if(response.data?.data1?.notuserCreated){
        alert('User already exists');
        this.email='';
        this.name = '';
        this.uname = '';
        this.pass = '';
        this.rpass = '';
      }
      else{
        this.router.navigate(['./login']);
        alert('Success User Created');
      }
    }, (error) => {
      console.log(error);
    });
  }
}

