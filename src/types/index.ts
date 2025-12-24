// User types
export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// Comment types
export interface Comment {
  _id: string;
  content: string;
  user: User;
  parentComment: string | null;
  likes: string[];
  dislikes: string[];
  likesCount: number;
  dislikesCount: number;
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommentResponse {
  success: boolean;
  data: {
    comments: Comment[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalComments: number;
      limit: number;
    };
  };
  message: string;
}

export interface CreateCommentData {
  content: string;
  parentComment?: string | null;
}

export interface UpdateCommentData {
  content: string;
}

// Sorting and pagination
export type SortOption = "newest" | "mostLiked" | "mostDisliked";

export interface PaginationParams {
  page: number;
  limit: number;
  sort: SortOption;
  parentComment?: string | null;
}

// API Error
export interface ApiError {
  success: boolean;
  message: string;
  error?: string;
}
