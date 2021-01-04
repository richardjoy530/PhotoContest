import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { RootComponent } from './root/root.component';
import { RouterModule, RouterOutlet } from '@angular/router';

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
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule { 
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData
  }
}