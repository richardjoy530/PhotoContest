import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  constructor(private authService: AuthService, private route: Router) {
    document.body.classList.add("bg")
  }
  login(event: any) {
    var username = event.target.username.value
    var password = event.target.password.value
    this.authService.authenticate(username, password)
    if (this.authService.authenticate(username, password)) {
      this.route.navigate(["gallery"])
    }
  }
}
