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
  resultsVisible = false
  uploading = false
  expanded = false
  imgSelected = false
  file: any
  uploadPercent: any
  downloadURL: any
  caption: string | undefined
  selectedImage!: PhotoEntryID;

  photoEntryConnection: AngularFirestoreCollection<PhotoEntry>;
  photoEntries: Observable<PhotoEntryID[]>


  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage, public authService: AuthService) {
    document.body.classList.remove("bg")
    var theme = "Architecture" // Need to fix this one day
    console.log(this.authService.config?.theme)
    if (this.authService.config) {
      console.log(this.authService)
      theme = this.authService.config.theme
    }
    this.photoEntryConnection = firestore.collection<PhotoEntry>(theme)
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
    if (this.caption && this.imgSelected) {
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
                author: this.authService.currentUser?.displayName,
                likedPeoples: []
              }
              this.addToFirestore(photoEntry)
            }
          })
          this.popUpVisible = false
        })
      ).subscribe()
    }
  }

  addToFirestore(entry: PhotoEntry) {
    this.photoEntryConnection.add(entry)
  }

  useVote(priority: number, id: string) {

    if (this.authService.userData) {
      const first = this.authService.userData.first
      const second = this.authService.userData.second
      const third = this.authService.userData.third
      this.authService.userData = {
        first: priority == 1 ? first ? "" : id : first,
        second: priority == 2 ? second ? "" : id : second,
        third: priority == 3 ? third ? "" : id : third,
      }
      this.authService.updateUserVotes(this.authService.userData)
    }

  }

  onVoted(priority: number, entry: PhotoEntryID) {
    var ref = this.firestore.doc(this.authService.config?.theme + '/' + entry.id)
    if (this.authService.currentUser?.uid) {
      this.useVote(priority, entry.id)
      if (!entry.likedPeoples.includes(this.authService.currentUser.uid)) {
        var likedUsers = entry.likedPeoples
        likedUsers.push(this.authService.currentUser.uid)
        ref.update({
          score: priority == 1 ? entry.score + 20 : priority == 2 ? entry.score + 10 : entry.score + 5,
          likedPeoples: likedUsers
        })
      }
      else {
        var likedUsers = entry.likedPeoples
        likedUsers.splice(likedUsers.indexOf(this.authService.currentUser.uid))
        ref.update({
          score: priority == 1 ? entry.score - 20 : priority == 2 ? entry.score - 10 : entry.score - 5,
          likedPeoples: likedUsers
        })
      }
    }
    this.authService.userData?.first == "" ?
      this.authService.userData?.second == "" ?
        this.authService.userData?.third == "" ? 3 : 2 : 1 : 0

    if (this.expanded)
      this.expandImage(entry)
  }

  onLike(entry: PhotoEntryID) {
    if (this.authService.currentUser?.uid)
      if (this.authService.userData?.first == entry.id)
        this.onVoted(1, entry)
      else if (this.authService.userData?.second == entry.id)
        this.onVoted(2, entry)
      else if (this.authService.userData?.third == entry.id)
        this.onVoted(3, entry)
      else if (this.authService.userData?.first == "")
        this.onVoted(1, entry)
      else if (this.authService.userData?.second == "")
        this.onVoted(2, entry)
      else if (this.authService.userData?.third == "")
        this.onVoted(3, entry)
  }

  getRemainingVotes() {
    var votes = this.authService.userData?.first == "" ? 1 : 0
    votes += this.authService.userData?.second == "" ? 1 : 0
    votes += this.authService.userData?.third == "" ? 1 : 0
    return votes
  }

  logout() {
    this.authService.logout()
  }

  isVoted(id: string) {
    return this.authService.userData?.first == id || this.authService.userData?.second == id || this.authService.userData?.third == id ? true : false
  }

  expandImage(entry: PhotoEntryID) {
    // var first = document.getElementById('first')
    // var second = document.getElementById('second')
    // var third = document.getElementById('third')
    this.selectedImage = entry
    this.expanded = true
    // if (this.authService.userData?.first == entry.id)
    //   first?.classList.add('selected-vote')
    // else if (this.authService.userData?.second == entry.id)
    //   second?.classList.add('selected-vote')
    // else if (this.authService.userData?.third == entry.id)
    //   third?.classList.add('selected-vote')
  }

  download() {
    window.open(this.selectedImage.photoUrl)
  }

}
