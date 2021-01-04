import { Injectable } from '@angular/core';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usersList: any[];
  currentUser: User | undefined

  constructor() {
    this.usersList = [
      new User("Richard", "richard123"),
      new User("Admin", "admin123"),
    ]
  }

  authenticate(username: string, password: any) {
    var success = false
    this.usersList.forEach(user => {
      if (user.username.toLowerCase() == username && user.password == password) {
        this.currentUser = user
        success = true
      }
    });
    return success ? true : false
  }
}


