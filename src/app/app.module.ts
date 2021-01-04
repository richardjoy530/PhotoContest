import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LoginComponent } from './components/login/login.component';
import { RootComponent } from './components/root/root.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

const route = [{
  path: "",
  redirectTo: "login",
  pathMatch: 'full',
},
{
  path: "login",
  component: LoginComponent,
  data: { animation: "login" }
}, {
  path: "**",
  redirectTo: "login",
  pathMatch: 'full',
}]
@NgModule({
  declarations: [
    LoginComponent,
    RootComponent
  ],
  imports: [
    RouterModule.forRoot(route),
    BrowserModule,
  ],
  providers: [AuthService],
  bootstrap: [RootComponent]
})
export class AppModule { 
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData
  }
}