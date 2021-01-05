import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireStorageModule } from '@angular/fire/storage';
import { LoginComponent } from './components/login/login.component';
import { RootComponent } from './components/root/root.component';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { GalleryComponent } from './components/gallery/gallery.component';
import { route } from './Routes'
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    LoginComponent,
    RootComponent,
    GalleryComponent,
  ],
  imports: [
    RouterModule.forRoot(route),
    BrowserModule,
    CommonModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
  ],
  providers: [AuthService],
  bootstrap: [RootComponent]
})
export class AppModule { }