import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  email: string | undefined;
  password: string | undefined;
  constructor(private authService: AuthService, private route: Router) {
    document.body.classList.add('bg');
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }

  loginWithEmail(): void{
    this.authService.loginWithEmail(this.email ? this.email : '', this.password ? this.password : '');
  }

}
