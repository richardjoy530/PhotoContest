import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  login(event:any){
    console.log(event.target.username.value)
    var username = event.target.username.value
    var password = event.target.password.value
  }
}
