import React from 'react';
import { useAppSelector } from '../app/hooks';
import CommentItem from './CommentItem';
import './CommentList.scss';

const CommentList: React.FC = () => {
  const { comments, loading } = useAppSelector((state) => state.comments);

  if (!loading && comments.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">💬</div>
        <h3>No comments yet</h3>
        <p>Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;
