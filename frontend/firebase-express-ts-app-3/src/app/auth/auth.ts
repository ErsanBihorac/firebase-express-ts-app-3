import { Component, computed, inject, signal } from '@angular/core';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { AuthService } from '../services/auth-service';
import { FormData } from '../interfaces/formData.interface';

@Component({
  selector: 'app-auth',
  imports: [FormField],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  authService = inject(AuthService);
  authMode = signal<'login' | 'signin'>('login');
  btnMessage = computed(() => (this.authMode() === 'login' ? 'login' : 'sign in'));

  formModel = signal<FormData>({
    email: '',
    password: '',
  });

  form = form(this.formModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });
    required(schemaPath.password, { message: 'Password is required' });
  });

  setAuthMode(mode: 'login' | 'signin') {
    this.authMode.set(mode);
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    await submit(this.form, async () => {
      const { email, password } = this.formModel();
      if (this.authMode() === 'login') {
        await this.authService.login(email, password);
      } else {
        await this.authService.register(email, password);
      }
    });
  }

  async onGoogleLogin() {
    await this.authService.loginWithGooglePopup();
  }
}
