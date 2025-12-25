import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useAuth } from '../hooks/useAuth';
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
  onReplyUpdate?: (updatedReply: Comment) => void;
  onReplyDelete?: (deletedReplyId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, isReply = false, onReplyUpdate, onReplyDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { replyingTo } = useAppSelector((state) => state.comments);

  // Helper to get author info from different response structures
  const getAuthorInfo = () => {
    if (comment.authorDetails) {
      return {
        id: typeof comment.author === 'string' ? comment.author : comment.author._id,
        name: comment.authorDetails.name,
        email: comment.authorDetails.email,
      };
    }
    if (typeof comment.author === 'object') {
      return {
        id: comment.author._id,
        name: comment.author.name,
        email: comment.author.email,
      };
    }
    if (comment.user) {
      return {
        id: comment.user._id,
        name: comment.user.name,
        email: comment.user.email,
      };
    }
    return { id: '', name: 'Unknown User', email: '' };
  };

  const authorInfo = getAuthorInfo();
  const isOwner = user?.id === authorInfo.id;
  const hasLiked = comment.likes.includes(user?.id || '');
  const hasDisliked = comment.dislikes.includes(user?.id || '');
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
      const result = await dispatch(
        updateComment({
          id: comment._id,
          data: { content: editContent.trim() },
        })
      ).unwrap();
      setIsEditing(false);
      
      // If this is a reply and we have a callback, notify the parent
      if (isReply && onReplyUpdate && result) {
        const responseData = result.data || result;
        const updatedComment = responseData.comment || responseData.data?.comment;
        if (updatedComment) {
          onReplyUpdate(updatedComment);
        }
      }
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await dispatch(deleteComment(comment._id)).unwrap();
        
        // If this is a reply and we have a callback, notify the parent
        if (isReply && onReplyDelete) {
          onReplyDelete(comment._id);
        }
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  const handleLike = async () => {
    try {
      const result = await dispatch(likeComment(comment._id)).unwrap();
      
      // Extract the updated comment from the response
      const responseData = result.data || result;
      const updatedComment = responseData.comment || responseData.data?.comment;
      
      // If this is a reply and we have a callback, notify the parent
      if (isReply && onReplyUpdate && updatedComment) {
        onReplyUpdate(updatedComment);
      }
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const handleDislike = async () => {
    try {
      const result = await dispatch(dislikeComment(comment._id)).unwrap();
      
      // Extract the updated comment from the response
      const responseData = result.data || result;
      const updatedComment = responseData.comment || responseData.data?.comment;
      
      // If this is a reply and we have a callback, notify the parent
      if (isReply && onReplyUpdate && updatedComment) {
        onReplyUpdate(updatedComment);
      }
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
      
      // Backend response structure: { status: "success", data: { comments: [...], pagination: {...} } }
      const repliesData = response.data?.comments || [];
      console.log('Full response:', response); // Debug log
      console.log('Loaded replies:', repliesData); // Debug log
      setReplies(repliesData);
      setShowReplies(true);
    } catch (error) {
      console.error('Failed to load replies:', error);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleReplySuccess = () => {
    // Reload replies after successful reply, and show them if hidden
    setShowReplies(false); // Reset state first
    loadReplies(); // This will fetch and show replies
  };

  const handleReplyUpdate = (updatedReply: Comment) => {
    // Update the specific reply in the local state
    setReplies(prevReplies => 
      prevReplies.map(reply => 
        reply._id === updatedReply._id ? updatedReply : reply
      )
    );
  };

  const handleReplyDelete = (deletedReplyId: string) => {
    // Remove the deleted reply from the local state
    setReplies(prevReplies => 
      prevReplies.filter(reply => reply._id !== deletedReplyId)
    );
  };

  return (
    <div className={`comment-item ${isReply ? 'reply' : ''}`}>
      <div className="comment-header">
        <div className="user-info">
          <div className="avatar">{authorInfo.name.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <span className="username">{authorInfo.name}</span>
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
            👍 {comment.likesCount ?? comment.likes.length}
          </button>
          <button
            onClick={handleDislike}
            className={`interaction-btn ${hasDisliked ? 'active disliked' : ''}`}
          >
            👎 {comment.dislikesCount ?? comment.dislikes.length}
          </button>
          {!isReply && (
            <button onClick={handleReply} className="interaction-btn">
              💬 Reply
            </button>
          )}
        </div>

        {!isReply && (
          <button onClick={loadReplies} className="show-replies-btn">
            {loadingReplies
              ? 'Loading...'
              : showReplies
              ? `Hide replies ${replies.length > 0 ? `(${replies.length})` : ''}`
              : comment.repliesCount
              ? `View ${comment.repliesCount} ${comment.repliesCount === 1 ? 'reply' : 'replies'}`
              : 'View replies'}
          </button>
        )}
      </div>

      {isReplying && (
        <div className="reply-form">
          <CommentForm parentCommentId={comment._id} onSuccess={handleReplySuccess} />
        </div>
      )}

      {showReplies && (
        <div className="replies-section">
          {replies.length > 0 ? (
            replies.map((reply) => (
              <CommentItem 
                key={reply._id} 
                comment={reply} 
                isReply={true}
                onReplyUpdate={handleReplyUpdate}
                onReplyDelete={handleReplyDelete}
              />
            ))
          ) : (
            <div className="no-replies">No replies yet. Be the first to reply!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
