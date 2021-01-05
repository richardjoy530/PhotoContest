import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.sass']
})
export class GalleryComponent {
  popUpVisible = false
  file: any
  constructor(private route: Router, private storage: AngularFireStorage) {
    document.body.classList.remove("bg")
  }
  chooseFile() {
    document.querySelector(".input-file")?.dispatchEvent(new MouseEvent("click"))
  }

  saveFile(event: any) {
    this.file = event.target.files[0];
  }

  upload() {
    var filePath = `/entries/${new Date().getTime()}`;
    const task = this.storage.upload(filePath, this.file);
    this.popUpVisible = false
  }

  logout() {
    this.route.navigate(["login"])
  }
}
