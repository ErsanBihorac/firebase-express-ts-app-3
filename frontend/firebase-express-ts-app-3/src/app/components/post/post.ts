import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class Post {
  private readonly posts = [
    { text: 'Idee: Eine App, die Lieblingsorte speichert.', author: 'maria', likes: 128 },
    { text: 'Feature: Dark Mode + schnelle Suche.', author: 'jan', likes: 92 },
    { text: 'Use Case: Kleine To‑Do‑Liste mit Kategorien.', author: 'lea', likes: 64 },
    { text: 'Nächstes: Auth + Profilseite bauen.', author: 'alex', likes: 210 },
  ];

  private readonly index = signal(0);
  currentText = computed(() => this.posts[this.index()].text);
  currentAuthor = computed(() => this.posts[this.index()].author);
  currentLikes = computed(() => this.posts[this.index()].likes);
  nextText = computed(() => this.posts[(this.index() + 1) % this.posts.length].text);
  swipeDir = signal<'left' | 'right' | null>(null);
  isResetting = signal(false);
  private isAnimating = false;

  like() {
    this.triggerSwipe('right');
  }

  skip() {
    this.triggerSwipe('left');
  }

  private triggerSwipe(dir: 'left' | 'right') {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.swipeDir.set(dir);

    setTimeout(() => {
      this.index.update((i) => (i + 1) % this.posts.length);
      this.isResetting.set(true);
      this.swipeDir.set(null);
      requestAnimationFrame(() => {
        this.isResetting.set(false);
        this.isAnimating = false;
      });
    }, 260);
  }
}
