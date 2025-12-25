import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as commentAPI from "../../services/api";
import type {
  Comment,
  CreateCommentData,
  PaginationParams,
  SortOption,
  UpdateCommentData,
} from "../../types";

interface CommentState {
  comments: Comment[];
  currentComment: Comment | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalComments: number;
    limit: number;
  };
  sortBy: SortOption;
  replyingTo: string | null;
}

const initialState: CommentState = {
  comments: [],
  currentComment: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalComments: 0,
    limit: 10,
  },
  sortBy: "newest",
  replyingTo: null,
};

// Async thunks
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (params: PaginationParams, { rejectWithValue }) => {
    try {
      const response = await commentAPI.getComments(params);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to fetch comments"
      );
    }
  }
);

export const fetchCommentById = createAsyncThunk(
  "comments/fetchCommentById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await commentAPI.getCommentById(id);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to fetch comment"
      );
    }
  }
);

export const fetchCommentReplies = createAsyncThunk(
  "comments/fetchCommentReplies",
  async (
    {
      commentId,
      page,
      limit,
    }: { commentId: string; page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await commentAPI.getCommentReplies(
        commentId,
        page,
        limit
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to fetch replies"
      );
    }
  }
);

export const createComment = createAsyncThunk(
  "comments/createComment",
  async (data: CreateCommentData, { rejectWithValue }) => {
    try {
      const response = await commentAPI.createComment(data);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to create comment"
      );
    }
  }
);

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async (
    { id, data }: { id: string; data: UpdateCommentData },
    { rejectWithValue }
  ) => {
    try {
      const response = await commentAPI.updateComment(id, data);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to update comment"
      );
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (id: string, { rejectWithValue }) => {
    try {
      await commentAPI.deleteComment(id);
      return id;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to delete comment"
      );
    }
  }
);

export const likeComment = createAsyncThunk(
  "comments/likeComment",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await commentAPI.likeComment(id);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to like comment"
      );
    }
  }
);

export const dislikeComment = createAsyncThunk(
  "comments/dislikeComment",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await commentAPI.dislikeComment(id);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      return rejectWithValue(
        axiosError.response?.data?.message || "Failed to dislike comment"
      );
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },
    setReplyingTo: (state, action: PayloadAction<string | null>) => {
      state.replyingTo = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    addCommentOptimistic: (state, action: PayloadAction<Comment>) => {
      // Prevent duplicate insertion if the comment already exists (same _id)
      const exists = state.comments.some((c) => c._id === action.payload._id);
      if (!exists) {
        state.comments.unshift(action.payload);
        state.pagination.totalComments += 1;
      }
    },
    updateCommentOptimistic: (state, action: PayloadAction<Comment>) => {
      const index = state.comments.findIndex(
        (c) => c._id === action.payload._id
      );
      if (index !== -1) {
        state.comments[index] = action.payload;
      }
    },
    removeComment: (state, action: PayloadAction<string>) => {
      state.comments = state.comments.filter((c) => c._id !== action.payload);
      state.pagination.totalComments -= 1;
    },
    updateCommentCounts: (
      state,
      action: PayloadAction<{
        commentId: string;
        likesCount: number;
        dislikesCount: number;
      }>
    ) => {
      const index = state.comments.findIndex(
        (c) => c._id === action.payload.commentId
      );
      if (index !== -1) {
        state.comments[index] = {
          ...state.comments[index],
          likesCount: action.payload.likesCount,
          dislikesCount: action.payload.dislikesCount,
          likes: new Array(action.payload.likesCount).fill(""),
          dislikes: new Array(action.payload.dislikesCount).fill(""),
        };
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch comments
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        // Backend returns: { status: "success", data: { comments: [...], pagination: {...} } }
        const data = action.payload.data || action.payload;
        state.comments = data.comments || [];
        state.pagination = data.pagination || state.pagination;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch comment by ID
    builder.addCase(fetchCommentById.fulfilled, (state, action) => {
      const responseData = action.payload.data || action.payload;
      state.currentComment =
        responseData.comment || responseData.data?.comment || null;
    });

    // Fetch comment replies
    builder.addCase(fetchCommentReplies.fulfilled, (state) => {
      // Replies will be handled separately
      state.loading = false;
    });

    // Create comment
    builder
      .addCase(createComment.fulfilled, (state, action) => {
        const responseData = action.payload.data || action.payload;
        const newComment = responseData.comment || responseData.data?.comment;

        // If it's a top-level comment, add it to the list
        if (newComment && !newComment.parentComment) {
          // Avoid duplicates when server emits the same comment via WebSocket
          const already = state.comments.some((c) => c._id === newComment._id);
          if (!already) {
            state.comments.unshift(newComment);
            state.pagination.totalComments += 1;
          }
        }
        state.replyingTo = null;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Update comment
    builder.addCase(updateComment.fulfilled, (state, action) => {
      const responseData = action.payload.data || action.payload;
      const updatedComment = responseData.comment || responseData.data?.comment;

      if (updatedComment) {
        const index = state.comments.findIndex(
          (c) => c._id === updatedComment._id
        );
        if (index !== -1) {
          state.comments[index] = updatedComment;
        }
      }
    });

    // Delete comment
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      state.comments = state.comments.filter((c) => c._id !== action.payload);
      state.pagination.totalComments -= 1;
    });

    // Like comment
    builder.addCase(likeComment.fulfilled, (state, action) => {
      const responseData = action.payload.data || action.payload;
      const likedComment = responseData.comment || responseData.data?.comment;

      if (likedComment) {
        const index = state.comments.findIndex(
          (c) => c._id === likedComment._id
        );
        if (index !== -1) {
          state.comments[index] = likedComment;
        }
      }
    });

    // Dislike comment
    builder.addCase(dislikeComment.fulfilled, (state, action) => {
      const responseData = action.payload.data || action.payload;
      const dislikedComment =
        responseData.comment || responseData.data?.comment;

      if (dislikedComment) {
        const index = state.comments.findIndex(
          (c) => c._id === dislikedComment._id
        );
        if (index !== -1) {
          state.comments[index] = dislikedComment;
        }
      }
    });
  },
});

export const {
  setSortBy,
  setReplyingTo,
  clearError,
  addCommentOptimistic,
  updateCommentOptimistic,
  removeComment,
  updateCommentCounts,
} = commentSlice.actions;
export default commentSlice.reducer;
