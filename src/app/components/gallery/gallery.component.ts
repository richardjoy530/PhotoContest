import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, first, map } from 'rxjs/operators';
import { PhotoEntry, PhotoEntryID } from 'src/app/model/PhotoEntry';
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
  photoEntries: Observable<PhotoEntryID[]>


  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage, public authService: AuthService) {
    document.body.classList.remove("bg")
    this.photoEntryConnection = firestore.collection<PhotoEntry>('photoEntries')
    this.photoEntries = this.photoEntryConnection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as PhotoEntry
          const id = a.payload.doc.id
          return { id, ...data }
        })
      })
    )

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
    if (!this.caption) this.caption = ""
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

  useVote(priority: number, id: string) {

    if (this.authService.userData) {
      const first = this.authService.userData.first
      const second = this.authService.userData.second
      const third = this.authService.userData.third
      this.authService.userData={
        first: priority == 1 ? first ? "" : id : first,
        second: priority == 2 ? second ? "" : id : second,
        third: priority == 3 ? third ? "" : id : third,
      }
      this.authService.updateUserVotes(this.authService.userData)
    }
  }

  onVoted(priority: number, entry: PhotoEntryID) {
    var ref = this.firestore.doc('photoEntries/' + entry.id)
    ref.update({
      score: priority == 1 ? entry.score + 20 : priority == 2 ? entry.score + 10 : entry.score + 5,
    })
  }

  onLike(entry: PhotoEntryID) {

  }

  logout() {
    this.authService.logout()
  }
}
