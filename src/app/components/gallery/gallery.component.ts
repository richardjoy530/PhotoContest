import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { PhotoEntry } from 'src/app/model/PhotoEntity';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.sass']
})
export class GalleryComponent {


  popUpVisible = false
  uploading = false
  imgSelected = false
  file: any
  uploadPercent: any
  downloadURL: any
  caption: string | undefined

  photoEntryConnection: AngularFirestoreCollection<PhotoEntry>;
  photoEntries:Observable<PhotoEntry[]>


  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage, public authService: AuthService) {
    document.body.classList.remove("bg")
    this.photoEntryConnection = firestore.collection<PhotoEntry>('photoEntries')
    this.photoEntries = this.photoEntryConnection.valueChanges()
  }


  onUpload() {
    this.popUpVisible = true
    this.uploading = false
    this.imgSelected = false
    document.getElementById("preview")?.setAttribute('hidden', 'true')
  }

  chooseFile() {
    document.querySelector(".input-file")?.dispatchEvent(new MouseEvent("click"))
  }

  onFileSelected(event: any) {
    this.imgSelected = true
    this.file = event.target.files[0]
    document.getElementById("preview")?.setAttribute("src", URL.createObjectURL(this.file))
    document.getElementById("preview")?.classList.remove("nano")
  }

  uploadToFireStorage() {
    this.uploading = true
    var filePath = `/entries/${new Date().getTime()}`
    const task = this.storage.upload(filePath, this.file)
    const fileRef = this.storage.ref(filePath)
    this.uploadPercent = task.percentageChanges()
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url: any) => {
          if (url) {
            this.downloadURL = url
            var photoEntry: PhotoEntry
            photoEntry = {
              caption: this.caption,
              photoUrl: this.downloadURL,
              score: 0,
              timeUploaded: Date.now(),
              uid: this.authService.currentUser?.uid,
              author: this.authService.currentUser?.displayName
            }
            this.addToFirestore(photoEntry)
          }
        })
        this.popUpVisible = false
      })
    ).subscribe()
  }

  addToFirestore(entry: PhotoEntry) {
    this.photoEntryConnection.add(entry)
  }

  logout() {
    this.authService.logout()
  }
}
