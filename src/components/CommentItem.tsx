import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    deleteComment,
    dislikeComment,
    fetchCommentReplies,
    likeComment,
    setReplyingTo,
    updateComment,
} from '../features/comments/commentSlice';
import type { Comment } from '../types';
import CommentForm from './CommentForm';
import './CommentItem.scss';

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, isReply = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { replyingTo } = useAppSelector((state) => state.comments);

  const isOwner = user?._id === comment.user._id;
  const hasLiked = comment.likes.includes(user?._id || '');
  const hasDisliked = comment.dislikes.includes(user?._id || '');
  const isReplying = replyingTo === comment._id;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;

    try {
      await dispatch(
        updateComment({
          id: comment._id,
          data: { content: editContent.trim() },
        })
      ).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await dispatch(deleteComment(comment._id)).unwrap();
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  const handleLike = async () => {
    try {
      await dispatch(likeComment(comment._id)).unwrap();
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const handleDislike = async () => {
    try {
      await dispatch(dislikeComment(comment._id)).unwrap();
    } catch (error) {
      console.error('Failed to dislike comment:', error);
    }
  };

  const handleReply = () => {
    dispatch(setReplyingTo(isReplying ? null : comment._id));
  };

  const loadReplies = async () => {
    if (showReplies) {
      setShowReplies(false);
      return;
    }

    setLoadingReplies(true);
    try {
      const response = await dispatch(
        fetchCommentReplies({
          commentId: comment._id,
          page: 1,
          limit: 10,
        })
      ).unwrap();
      setReplies(response.comments);
      setShowReplies(true);
    } catch (error) {
      console.error('Failed to load replies:', error);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleReplySuccess = () => {
    // Reload replies after successful reply
    if (showReplies) {
      loadReplies();
    }
  };

  return (
    <div className={`comment-item ${isReply ? 'reply' : ''}`}>
      <div className="comment-header">
        <div className="user-info">
          <div className="avatar">{comment.user.name.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <span className="username">{comment.user.name}</span>
            <span className="timestamp">{formatDate(comment.createdAt)}</span>
            {comment.updatedAt !== comment.createdAt && (
              <span className="edited">(edited)</span>
            )}
          </div>
        </div>

        {isOwner && !isEditing && (
          <div className="comment-actions">
            <button onClick={() => setIsEditing(true)} className="action-btn edit">
              ✏️ Edit
            </button>
            <button onClick={handleDelete} className="action-btn delete">
              🗑️ Delete
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="edit-section">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="edit-textarea"
            rows={3}
          />
          <div className="edit-actions">
            <button onClick={() => setIsEditing(false)} className="cancel-btn">
              Cancel
            </button>
            <button onClick={handleEdit} className="save-btn">
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="comment-content">{comment.content}</div>
      )}

      <div className="comment-footer">
        <div className="interaction-buttons">
          <button
            onClick={handleLike}
            className={`interaction-btn ${hasLiked ? 'active liked' : ''}`}
          >
            👍 {comment.likesCount}
          </button>
          <button
            onClick={handleDislike}
            className={`interaction-btn ${hasDisliked ? 'active disliked' : ''}`}
          >
            👎 {comment.dislikesCount}
          </button>
          {!isReply && (
            <button onClick={handleReply} className="interaction-btn">
              💬 Reply
            </button>
          )}
        </div>

        {!isReply && comment.repliesCount > 0 && (
          <button onClick={loadReplies} className="show-replies-btn">
            {loadingReplies
              ? 'Loading...'
              : showReplies
              ? `Hide replies`
              : `View ${comment.repliesCount} ${comment.repliesCount === 1 ? 'reply' : 'replies'}`}
          </button>
        )}
      </div>

      {isReplying && (
        <div className="reply-form">
          <CommentForm parentCommentId={comment._id} onSuccess={handleReplySuccess} />
        </div>
      )}

      {showReplies && replies.length > 0 && (
        <div className="replies-section">
          {replies.map((reply) => (
            <CommentItem key={reply._id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
