import axios from "axios";
import type {
  CreateCommentData,
  LoginCredentials,
  PaginationParams,
  RegisterCredentials,
  UpdateCommentData,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const register = (credentials: RegisterCredentials) => {
  return api.post("/api/auth/register", credentials);
};

export const login = (credentials: LoginCredentials) => {
  return api.post("/api/auth/login", credentials);
};

export const getCurrentUser = () => {
  return api.get("/api/auth/me");
};

// Comments API
export const getComments = (params: PaginationParams) => {
  const queryParams = new URLSearchParams();
  queryParams.append("page", params.page.toString());
  queryParams.append("limit", params.limit.toString());
  queryParams.append("sort", params.sort);

  if (params.parentComment !== undefined) {
    queryParams.append(
      "parentComment",
      params.parentComment === null ? "null" : params.parentComment
    );
  }

  return api.get(`/api/comments?${queryParams.toString()}`);
};

export const getCommentById = (id: string) => {
  return api.get(`/api/comments/${id}`);
};

export const getCommentReplies = (
  commentId: string,
  page: number,
  limit: number
) => {
  return api.get(
    `/api/comments/${commentId}/replies?page=${page}&limit=${limit}`
  );
};

export const createComment = (data: CreateCommentData) => {
  return api.post("/api/comments", data);
};

export const updateComment = (id: string, data: UpdateCommentData) => {
  return api.put(`/api/comments/${id}`, data);
};

export const deleteComment = (id: string) => {
  return api.delete(`/api/comments/${id}`);
};

export const likeComment = (id: string) => {
  return api.post(`/api/comments/${id}/like`);
};

export const dislikeComment = (id: string) => {
  return api.post(`/api/comments/${id}/dislike`);
};

export default api;
