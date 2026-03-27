import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { User } from '@angular/fire/auth';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  user$ = this.authService.user$;
  user = toSignal(this.user$, { initialValue: null });
  appTitle = signal('Appidea');
  btnMessage = computed(() => (this.user() ? 'sign out' : 'sign in'));
  btnRouterLink = computed(() => (this.user() ? '/' : '/auth'));

  ngOnInit(): void {
    this.authService.onLogin$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
      if (user) this.onUserAvailable(user);
    });
  }

  private onUserAvailable(user: User): void {
    // TODO: setze hier deine Aktion bei Login
    console.log('User logged in:', user.uid);
  }
}
