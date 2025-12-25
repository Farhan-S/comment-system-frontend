import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch } from "../app/hooks";
import {
  addCommentOptimistic,
  removeComment,
  updateCommentCounts,
  updateCommentOptimistic,
} from "../features/comments/commentSlice";
import type { Comment } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useSocket = () => {
  const dispatch = useAppDispatch();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    console.log("🔌 Initializing Socket.IO connection...");

    const socket = io(API_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    // Connection events
    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket server:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from WebSocket:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ WebSocket connection error:", error.message);
    });

    // Comment created event
    socket.on(
      "comment:created",
      (data: { comment: Comment; parentComment: string | null }) => {
        console.log("📝 Real-time: New comment created", data);

        // Only add top-level comments to the main list
        // Replies will be handled by the reply system
        if (!data.parentComment) {
          dispatch(addCommentOptimistic(data.comment));
        }
      }
    );

    // Comment updated event
    socket.on("comment:updated", (data: { comment: Comment }) => {
      console.log("✏️ Real-time: Comment updated", data);
      dispatch(updateCommentOptimistic(data.comment));
    });

    // Comment deleted event
    socket.on(
      "comment:deleted",
      (data: { commentId: string; parentComment: string | null }) => {
        console.log("🗑️ Real-time: Comment deleted", data);
        dispatch(removeComment(data.commentId));
      }
    );

    // Comment liked event
    socket.on(
      "comment:liked",
      (data: {
        commentId: string;
        likesCount: number;
        dislikesCount: number;
        action: string;
      }) => {
        console.log("👍 Real-time: Comment liked", data);
        dispatch(
          updateCommentCounts({
            commentId: data.commentId,
            likesCount: data.likesCount,
            dislikesCount: data.dislikesCount,
          })
        );
      }
    );

    // Comment disliked event
    socket.on(
      "comment:disliked",
      (data: {
        commentId: string;
        likesCount: number;
        dislikesCount: number;
        action: string;
      }) => {
        console.log("👎 Real-time: Comment disliked", data);
        dispatch(
          updateCommentCounts({
            commentId: data.commentId,
            likesCount: data.likesCount,
            dislikesCount: data.dislikesCount,
          })
        );
      }
    );

    // Cleanup on unmount
    return () => {
      console.log("🔌 Disconnecting Socket.IO...");
      socket.disconnect();
    };
  }, [dispatch]);

  // Don't return the socket ref during render
  // If components need access to the socket, use a context provider instead
};
