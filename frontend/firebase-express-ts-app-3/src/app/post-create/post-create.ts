import { PostBtn } from '../components/post-btn/post-btn';
import { Post } from '../interfaces/post.interface';
import { form, required, submit, FormField } from '@angular/forms/signals';
import { PostService } from '../services/post-service';
import { AuthService } from '../services/auth-service';
import { Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-post-create',
  imports: [PostBtn, FormField],
  templateUrl: './post-create.html',
  styleUrl: './post-create.scss',
})
export class PostCreate {
  authService = inject(AuthService);
  postService = inject(PostService);
  postModel = signal<Post>({
    id: '',
    text: '',
    userId: '',
    userName: '',
    createdAt: '',
  });
  errMessage = signal<string>('please enter your text');
  errAuth = signal<string>('only signed in users can post');
  postForm = form(this.postModel, (schemaPath) => {
    required(schemaPath.text, { message: 'text message is required' });
  });

  async submitPost(event: Event) {
    event.preventDefault();
    const user = this.authService.getCurrentUser();
    if (user == null) return console.log('only logged in users post');

    await submit(this.postForm, async () => {
      const { text } = this.postModel();

      const res = this.postService.createPost(text);
      console.log(res);
    });
  }
}
