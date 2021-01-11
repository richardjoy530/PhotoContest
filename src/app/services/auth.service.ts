import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { UserData } from '../model/UserData';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: firebase.User | undefined
  userData: UserData | undefined

  constructor(public auth: AngularFireAuth, private route: Router, private firestore: AngularFirestore) {
    this.auth.user.subscribe((user: any) => this.currentUser = user)
    this.auth.authState.subscribe((user: any) => {
      if (user as firebase.User) {
        route.navigate(["gallery"])
        this.syncUserVotes()
      }
      else route.navigate(["login"])
    })

  }

  syncUserVotes() {
    // var a = this.firestore.doc("users/" + this.currentUser?.uid).valueChanges()
    // a.subscribe({
    //   next(x) { console.log('got value ' , x); },
    //   error(err) { console.error('something wrong occurred: ' + err); },
    //   complete() { console.log('done'); }
    // })

    this.firestore.doc("users/" + this.currentUser?.uid).valueChanges().subscribe((userd: any) => {
      if (userd == undefined)
        this.firestore.collection<UserData>('users').doc(this.currentUser?.uid).set({
            first: "",
            second: "",
            third: ""
        })
      else
        this.userData = userd
    })
  }

  updateUserVotes(userVotes: UserData) {
    this.firestore.collection<UserData>('users').doc(this.currentUser?.uid).update(userVotes)
  }

  loginWithGoogle() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
  }

  loginWithEmail(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password)
  }

  logout() {
    this.auth.signOut();
  }

}


