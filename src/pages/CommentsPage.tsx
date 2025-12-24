import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';
import Pagination from '../components/Pagination';
import SortMenu from '../components/SortMenu';
import { logout } from '../features/auth/authSlice';
import { fetchComments, setSortBy } from '../features/comments/commentSlice';
import type { SortOption } from '../types';
import './CommentsPage.scss';

const CommentsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { pagination, sortBy, loading } = useAppSelector((state) => state.comments);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Fetch comments when page, sort or limit changes
    dispatch(
      fetchComments({
        page: currentPage,
        limit: pagination.limit,
        sort: sortBy,
        parentComment: null, // Only fetch top-level comments
      })
    );
  }, [dispatch, currentPage, sortBy, pagination.limit]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSortChange = (sort: SortOption) => {
    dispatch(setSortBy(sort));
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="comments-page">
      <header className="comments-header">
        <div className="header-content">
          <h1>💬 Comment System</h1>
          <div className="user-info">
            <span className="user-name">👤 {user?.name}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="comments-container">
        <div className="comments-main">
          <div className="new-comment-section">
            <h2>Add a Comment</h2>
            <CommentForm />
          </div>

          <div className="comments-list-section">
            <div className="section-header">
              <h2>
                Comments ({pagination.totalComments})
              </h2>
              <SortMenu currentSort={sortBy} onSortChange={handleSortChange} />
            </div>

            {loading && currentPage === 1 ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading comments...</p>
              </div>
            ) : (
              <>
                <CommentList />
                {pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsPage;
