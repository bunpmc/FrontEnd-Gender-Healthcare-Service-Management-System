import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../Services/user.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BlogDetail } from '../../models/blog.model';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.css',
})
export class BlogDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private router = inject(Router);

  blog: BlogDetail | null = null;
  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    const blogId = this.route.snapshot.paramMap.get('id');
    if (!blogId) {
      this.error = 'Không tìm thấy blog!';
      this.isLoading = false;
      return;
    }

    this.userService.getBlogById(blogId).subscribe({
      next: (data) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (!data.content) {
          this.error = 'Blog không có nội dung!';
          this.isLoading = false;
          return;
        }
        this.blog = data as BlogDetail;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Không thể tải nội dung blog này.';
        this.isLoading = false;
      },
    });
  }

  getTags(): string[] {
    if (!this.blog) return [];
    const tags = this.blog.blog_tags;
    if (!tags) return [];
    if (Array.isArray(tags.tags)) return tags.tags;
    if (typeof tags.tags === 'string') {
      return tags.tags.split(',').map((t: string) => t.trim());
    }
    return [];
  }

  backToList() {
    // Tốt nhất dùng router.navigate, không dùng routerLink
    this.router.navigate(['/blog']);
    // Nếu muốn scroll lên đầu trang luôn:
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 10);
  }
}
