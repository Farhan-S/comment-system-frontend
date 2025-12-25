import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { createComment, setReplyingTo } from '../features/comments/commentSlice';
import './CommentForm.scss';

interface CommentFormProps {
  parentCommentId?: string | null;
  onSuccess?: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ parentCommentId = null, onSuccess }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.comments);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (content.length > 1000) {
      setError('Comment is too long (max 1000 characters)');
      return;
    }

    try {
      await dispatch(
        createComment({
          content: content.trim(),
          parentComment: parentCommentId,
        })
      ).unwrap();

      setContent('');
      setError('');
      
      if (parentCommentId) {
        dispatch(setReplyingTo(null));
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      setError(typeof err === 'string' ? err : 'Failed to post comment');
    }
  };

  const handleCancel = () => {
    setContent('');
    setError('');
    if (parentCommentId) {
      dispatch(setReplyingTo(null));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          if (error) setError('');
        }}
        placeholder={parentCommentId ? 'Write a reply...' : 'What are your thoughts?'}
        className={error ? 'error' : ''}
        disabled={loading}
        rows={parentCommentId ? 3 : 4}
        maxLength={1000}
      />
      
      <div className="form-footer">
        <div className="char-count">
          {content.length}/1000
        </div>
        
        {error && <span className="error-text">{error}</span>}
        
        <div className="form-actions">
          {parentCommentId && (
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
              disabled={loading}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="submit-button" disabled={loading || !content.trim()}>
            {loading ? 'Posting...' : parentCommentId ? 'Reply' : 'Post Comment'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
