import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-btn',
  imports: [RouterLink],
  templateUrl: './post-btn.html',
  styleUrl: './post-btn.scss',
})
export class PostBtn {
  router = inject(Router);
  btnMessage = computed(() => (this.router.url === '/' ? 'create post' : 'explore posts'));

  goToCreateOrHome(): string {
    if (this.router.url === '/') {
      return '/create';
    } else {
      return '/';
    }
  }
}
