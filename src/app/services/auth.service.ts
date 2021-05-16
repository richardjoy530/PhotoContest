import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { Configs } from '../model/Configs';
import { UserData } from '../model/UserData';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: firebase.User | undefined;
  userData: UserData | undefined;
  config: Configs | undefined;

  constructor(public auth: AngularFireAuth, private route: Router, private firestore: AngularFirestore) {
    this.auth.user.subscribe((user: any) => this.currentUser = user);
    this.auth.authState.subscribe((user: any) => {
      this.syncConfigs();
      if (user as firebase.User) {
        this.syncConfigs();
        route.navigate(['gallery']);
        console.log('to gallery');
        this.syncConfigs();

      }
      else {
        route.navigate(['login']);
        console.log('to login');
      }
    });

  }

  syncConfigs(): void {
    this.firestore.doc('configs/values').valueChanges().subscribe((configs: any) => {
      if (configs) {
        this.config = configs;
        console.log(this.config);
        this.syncUserVotes();
      }
    });
  }

  syncUserVotes(): void {
    // var a = this.firestore.doc("users/" + this.currentUser?.uid).valueChanges()
    // a.subscribe({
    //   next(x) { console.log('got value ' , x); },
    //   error(err) { console.error('something wrong occurred: ' + err); },
    //   complete() { console.log('done'); }
    // })

    this.firestore.doc(this.config?.theme + '_users/' + this.currentUser?.uid).valueChanges().subscribe((userd: any) => {
      if (userd === undefined && this.config?.theme) {
        this.firestore.collection<UserData>(this.config?.theme + '_users').doc(this.currentUser?.uid).set({
          first: '',
          second: '',
          third: ''
        });
      }
      else {
        this.userData = userd;
      }
    });
  }

  updateUserVotes(userVotes: UserData): void {
    if (this.config?.theme) {
      this.firestore.collection<UserData>(this.config?.theme + '_users').doc(this.currentUser?.uid).update(userVotes);
    }
  }

  loginWithGoogle(): void {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  loginWithEmail(email: string, password: string): void {
    this.auth.signInWithEmailAndPassword(email, password);
  }

  logout(): void {
    this.auth.signOut();
  }

}


