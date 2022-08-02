import { Injectable, Optional } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import type { User, UserCredential } from '@firebase/auth';
import { signInWithEmailAndPassword, signOut } from '@firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(@Optional() public auth: Auth) {}

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(): Promise<void> {
    return signOut(this.auth);
  }

  getAuthState(): Observable<User | null> {
    return authState(this.auth);
  }
}
