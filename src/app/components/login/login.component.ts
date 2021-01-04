import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  constructor(private authService:AuthService){}
  login(event:any){
    console.log(typeof(event))
    var username = event.target.username.value
    var password = event.target.password.value
    this.authService.authenticate(username,password)
    console.log(this.authService.authenticate(username,password))
  }
}
