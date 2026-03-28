import { inject, Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  orderBy,
  query,
  serverTimestamp,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Post } from '../interfaces/post.interface';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly firestore = inject(Firestore);
  private readonly postsRef = collection(this.firestore, 'posts');
  authService = inject(AuthService);

  async createPost(text: string) {
    const user = this.authService.getCurrentUser() as User;

    const doc: Post = {
      text,
      userId: user.uid,
      userName: user.displayName ?? 'no display name',
      createdAt: serverTimestamp(),
      likes: 0,
    };

    return await addDoc(this.postsRef, doc);
  }

  getPosts() {
    const q = query(this.postsRef);
    return collectionData(q, { idField: 'id' }) as Observable<Post[]>;
  }
}
