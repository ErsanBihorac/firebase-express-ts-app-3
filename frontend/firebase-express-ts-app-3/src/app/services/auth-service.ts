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
import { Router } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged, filter, map, pairwise } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(Auth);
  router = inject(Router);
  private readonly _user$ = new BehaviorSubject<User | null>(null);
  user$ = this._user$.asObservable();

  getCurrentUser() {
    const user = this._user$.getValue();
    if (user == null) console.log('no current user available');
    return user;
  }

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
        this.goToHome();
        console.log('user signed in');
      } else {
        this.setUser(null);
        console.log('no user signed in');
      }
    });
  }

  setUser(user: User | null) {
    this._user$.next(user);
  }

  async login(email: string, password: string) {
    const res = await signInWithEmailAndPassword(this.auth, email, password);
    if (!res) return console.log('login was unsuccessful');

    this.goToHome();
    return res.user;
  }

  async register(email: string, password: string) {
    const res = await createUserWithEmailAndPassword(this.auth, email, password);
    if (!res) return console.log('registration was unsuccessful');

    this.goToAuth();
    return res.user;
  }

  async loginWithGooglePopup() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider, browserPopupRedirectResolver);
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.goToAuth();
      return true;
    } catch (err) {
      console.error('logout failed', err);
      return false;
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToAuth() {
    this.router.navigate(['/auth']);
  }
}
