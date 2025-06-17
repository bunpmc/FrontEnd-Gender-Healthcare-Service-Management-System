import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { UserService } from '../../Services/user.service';
import { Blog } from '../../models/blog.model';

// Interface để map dữ liệu từ API sang format hiện tại
interface BlogDisplay {
  id: string;
  title: string;
  desc: string;
  img: string;
  author: string;
  createdAt: string;
  tags: string[];
  category: string;
}

@Component({
  selector: 'app-blogs-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './blogs-page.component.html',
  styleUrl: './blogs-page.component.css',
})
export class BlogsPageComponent implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);
  skeletons = Array.from({ length: 6 });
  allBlogs: BlogDisplay[] = [];
  isLoading = true;
  error: string | null = null;
  categories: string[] = [
    'All',
    'Community',
    'Mental Health',
    'Gender Stories',
    'Legal',
    'Education',
  ];
  selectedCategory: string = 'All';
  searchValue: string = '';

  // Pagination
  page = 1;
  perPage = 6;

  get maxPage() {
    return Math.ceil(this.filteredBlogs.length / this.perPage);
  }

  selectedTag: string | null = null;

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    this.isLoading = true;
    this.error = null;

    this.userService.getBlogs().subscribe({
      next: (blogs: Blog[]) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Debug: Log raw data to see actual structure
        console.log('Raw blogs data:', blogs);
        if (blogs.length > 0) {
          console.log('First blog structure:', blogs[0]);
          console.log('First blog tags:', blogs[0].blog_tags);
        }

        // Map dữ liệu từ API sang format hiện tại
        this.allBlogs = blogs.map((blog) => this.mapBlogToDisplay(blog));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
        this.error = 'Không thể tải danh sách blog. Vui lòng thử lại sau.';
        this.isLoading = false;
      },
    });
  }

  private mapBlogToDisplay(blog: Blog): BlogDisplay {
    // Safely extract tags array
    const tagsArray = this.extractTags(blog.blog_tags);

    return {
      id: blog.blog_id,
      title: blog.blog_title,
      desc: blog.excerpt,
      img: blog.image_link || '', // fallback image
      author: blog.doctor_details.full_name,
      createdAt: blog.created_at,
      tags: tagsArray,
      category: this.getCategoryFromTags(tagsArray), // Logic để xác định category
    };
  }

  private extractTags(blogTags: any): string[] {
    // Handle different possible structures of blog_tags
    if (!blogTags) return [];

    // If blog_tags.tags is an array
    if (Array.isArray(blogTags.tags)) {
      return blogTags.tags;
    }

    // If blog_tags itself is an array
    if (Array.isArray(blogTags)) {
      return blogTags;
    }

    // If it's a string, split by comma
    if (typeof blogTags === 'string') {
      return blogTags.split(',').map((tag) => tag.trim());
    }

    // If blog_tags.tags is a string
    if (typeof blogTags.tags === 'string') {
      return blogTags.tags.split(',').map((tag: string) => tag.trim());
    }

    return []; // fallback to empty array
  }

  private getCategoryFromTags(tags: string[]): string {
    // Check if tags is actually an array
    if (!Array.isArray(tags) || tags.length === 0) {
      return 'Community'; // default category
    }

    // Logic để map tags thành categories
    // Bạn có thể customize logic này dựa trên tags
    const tagMap: { [key: string]: string } = {
      transgender: 'Gender Stories',
      'hormone therapy': 'Gender Stories',
      'mental health': 'Mental Health',
      community: 'Community',
      legal: 'Legal',
      education: 'Education',
    };

    for (const tag of tags) {
      if (typeof tag === 'string') {
        const category = tagMap[tag.toLowerCase()];
        if (category) return category;
      }
    }

    return 'Community'; // default category
  }

  filterByTag(tag: string) {
    this.selectedTag = tag;
    this.selectedCategory = 'All';
    this.page = 1;
  }

  get filteredBlogs(): BlogDisplay[] {
    let result = this.allBlogs;

    if (this.selectedCategory !== 'All') {
      result = result.filter((b) => b.category === this.selectedCategory);
    }

    if (this.selectedTag) {
      result = result.filter((b) => b.tags.includes(this.selectedTag!));
    }

    if (this.searchValue) {
      const key = this.searchValue.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(key) ||
          b.desc.toLowerCase().includes(key) ||
          b.author.toLowerCase().includes(key) ||
          b.tags.some((tag) => tag.toLowerCase().includes(key))
      );
    }

    return result;
  }

  // Fixed: Get paginated blogs from filtered results
  get paginatedBlogs(): BlogDisplay[] {
    const filtered = this.filteredBlogs;
    const start = (this.page - 1) * this.perPage;
    const end = start + this.perPage;
    return filtered.slice(start, end);
  }

  clearTagFilter() {
    this.selectedTag = null;
  }

  // ===== PAGINATION =====
  goToPage(pg: number): void {
    if (pg < 1 || pg > this.maxPage) return;
    this.page = pg;
    // Removed updatePagination() call since we're using getter
  }

  get pageArray(): number[] {
    return Array.from({ length: this.maxPage }, (_, i) => i);
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
    this.page = 1;
  }

  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement)?.value ?? '';
    this.searchValue = val;
    this.page = 1;
  }

  // Method để retry khi có lỗi
  retryLoad() {
    this.loadBlogs();
  }
}
