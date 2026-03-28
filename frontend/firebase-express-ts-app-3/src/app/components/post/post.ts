import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PostService } from '../../services/post-service';
import type { Post as PostModel } from '../../interfaces/post.interface';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class Post implements OnInit {
  // private readonly posts = [
  //   { text: 'Idee: Eine App, die Lieblingsorte speichert.', author: 'maria', likes: 128 },
  //   { text: 'Feature: Dark Mode + schnelle Suche.', author: 'jan', likes: 92 },
  //   { text: 'Use Case: Kleine To‑Do‑Liste mit Kategorien.', author: 'lea', likes: 64 },
  //   { text: 'Nächstes: Auth + Profilseite bauen.', author: 'alex', likes: 210 },
  // ];

  posts = signal<PostModel[]>([]);
  private readonly destroyRef = inject(DestroyRef);
  postService = inject(PostService);
  private readonly index = signal(0);

  currentText = computed(() => {
    const list = this.posts();
    return list.length ? list[this.index()].text : '';
  });

  currentAuthor = computed(() => {
    const list = this.posts();
    return list.length ? list[this.index()].userName : '';
  });

  currentLikes = computed(() => {
    const list = this.posts();
    return list.length ? (list[this.index()].likes ?? 0) : 0;
  });

  nextText = computed(() => {
    const list = this.posts();
    return list.length ? list[(this.index() + 1) % list.length].text : '';
  });

  swipeDir = signal<'left' | 'right' | null>(null);
  isResetting = signal(false);
  private isAnimating = false;

  ngOnInit(): void {
    this.postService
      .getPosts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((posts) => {
        this.posts.set(posts);
        this.index.set(0);
      });
  }

  like() {
    this.triggerSwipe('right');
  }

  skip() {
    this.triggerSwipe('left');
  }

  private triggerSwipe(dir: 'left' | 'right') {
    if (this.isAnimating) return;
    if (this.posts().length === 0) return;
    this.isAnimating = true;
    this.swipeDir.set(dir);

    setTimeout(() => {
      this.index.update((i) => (i + 1) % this.posts().length);
      this.isResetting.set(true);
      this.swipeDir.set(null);
      requestAnimationFrame(() => {
        this.isResetting.set(false);
        this.isAnimating = false;
      });
    }, 260);
  }
}
