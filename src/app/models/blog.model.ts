export interface Blog {
  blog_id: string;
  blog_title: string; // Đổi từ 'title' thành 'blog_title'
  excerpt: string;
  image_link?: string | null; // có thể null
  blog_tags: {
    tags: string[];
  };
  blog_status: string;
  created_at: string;
  updated_at: string;
  doctor_details: {
    full_name: string;
  };
}
export interface BlogDetail {
  blog_id: string;
  blog_title: string;
  content: string;
  image_link?: string | null;
  blog_tags: {
    tags: string[] | string;
  };
  blog_status: string;
  created_at: string;
  updated_at: string;
  doctor_details: {
    full_name: string;
    image_link?: string | null;
  };
}
