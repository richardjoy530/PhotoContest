import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: firebase.User | undefined
  
  constructor(public auth: AngularFireAuth, private route: Router) {
    this.auth.user.subscribe((user: any) => this.currentUser = user)
    this.auth.authState.subscribe((user: any) => {
      if (user) route.navigate(["gallery"])
      else route.navigate(["login"])
    })
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


