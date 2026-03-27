import { Component } from '@angular/core';
import { Post } from '../components/post/post';
import { PostBtn } from '../components/post-btn/post-btn';

@Component({
  selector: 'app-home',
  imports: [Post, PostBtn],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
