import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  browserPopupRedirectResolver,
  User,
} from '@angular/fire/auth';
import { BehaviorSubject, distinctUntilChanged, filter, map, pairwise } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(Auth);
  private readonly _user$ = new BehaviorSubject<User | null>(null);
  user$ = this._user$.asObservable();

  isLoggedIn$ = this.user$.pipe(
    map((user) => user !== null),
    distinctUntilChanged(), // gibt nur neue Werte weiter, wenn sich der boolean wirklich ändert
  );

  onLogin$ = this.user$.pipe(
    pairwise(), // gibt ["vorheriger wert", "aktueller wert"] aus
    filter(([oldVal, newVal]) => oldVal === null && newVal !== null), // lässt nur den Fall null zu neuem User durch
    map(([, newVal]) => newVal as User), // gibt nur den aktuellen User zurück
  );

  constructor() {
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        this.setUser(user);
        console.log('User is signed in');
      } else {
        console.log('No user signed in');
      }
    });
  }

  setUser(user: User | null) {
    this._user$.next(user);
  }
}
