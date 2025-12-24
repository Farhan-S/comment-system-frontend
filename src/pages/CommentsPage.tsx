import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';
import Pagination from '../components/Pagination';
import SortMenu from '../components/SortMenu';
import { useAuth } from '../context/AuthContext';
import { fetchComments, setSortBy } from '../features/comments/commentSlice';
import { useSocket } from '../hooks/useSocket';
import type { SortOption } from '../types';
import './CommentsPage.scss';

const CommentsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, logout } = useAuth();
  const { pagination = { limit: 10, currentPage: 1, totalPages: 1, totalComments: 0 }, sortBy, loading } = useAppSelector((state) => state.comments);
  const [currentPage, setCurrentPage] = useState(1);

  // Enable real-time updates via WebSocket
  useSocket();

  useEffect(() => {
    // Fetch comments when page, sort or limit changes
    dispatch(
      fetchComments({
        page: currentPage,
        limit: pagination?.limit || 10,
        sort: sortBy,
        parentComment: null, // Only fetch top-level comments
      })
    );
  }, [dispatch, currentPage, sortBy, pagination?.limit]);

  const handleLogout = async () => {
    await logout();
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
                Comments ({pagination?.totalComments || 0})
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
                {(pagination?.totalPages || 0) > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={pagination?.totalPages || 1}
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
