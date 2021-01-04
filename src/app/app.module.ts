import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LoginComponent } from './components/login/login.component';
import { RootComponent } from './components/root/root.component';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { GalleryComponent } from './components/gallery/gallery.component';
import { route } from './Routes'


@NgModule({
  declarations: [
    LoginComponent,
    RootComponent,
    GalleryComponent
  ],
  imports: [
    RouterModule.forRoot(route),
    BrowserModule,
  ],
  providers: [AuthService],
  bootstrap: [RootComponent]
})
export class AppModule { }