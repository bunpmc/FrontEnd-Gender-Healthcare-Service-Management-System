import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../supabase.service';

interface BlogPost {
  blog_id: string;
  blog_title: string;
  blog_content: string;
  excerpt?: string;
  image_link?: string;
  blog_tags?: any;
  published_at?: string;
  blog_status?: string;
}

@Component({
  selector: 'app-blog-posts',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="text-xl font-bold mb-4">Blog Posts</h2>
    <div *ngIf="isLoading">Loading...</div>
    <div *ngIf="!isLoading && posts.length === 0">No blog posts found.</div>
    <div *ngIf="!isLoading && posts.length > 0" class="space-y-4">
      <div *ngFor="let post of posts" class="p-4 bg-white rounded shadow">
        <h3 class="font-semibold text-lg">{{ post.blog_title }}</h3>
        <p class="text-gray-600">{{ post.excerpt }}</p>
        <div class="text-xs text-gray-400">Status: {{ post.blog_status }}</div>
        <div class="text-xs text-gray-400">Published: {{ post.published_at || 'Draft' }}</div>
      </div>
    </div>
  `
})
export class BlogPostsComponent implements OnInit {
  posts: BlogPost[] = [];
  isLoading = false;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    this.isLoading = true;
    try {
      // Replace with actual doctor_id from auth/session
      const doctor_id = 'YOUR_DOCTOR_ID';
      this.posts = await this.supabase.getDoctorBlogPosts(doctor_id);
    } catch (e) {
      this.posts = [];
    } finally {
      this.isLoading = false;
    }
  }
}
