import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.sass']
})
export class GalleryComponent {
  popUpVisible = false
  constructor(private route: Router) {
    document.body.classList.remove("bg")
  }
  chooseFile() {
    document.querySelector(".input-file")?.dispatchEvent(new MouseEvent("click"))
  }

  upload() {
  }

  logout(){
    this.route.navigate(["login"])
  }
}
