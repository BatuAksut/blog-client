import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
}

interface Comment {
  id: string;
  content: string;
  user: User;
  createdAt: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  user?: User;
  comments?: Comment[];
}

const BASE_URL = "https://localhost:7171";

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const theme = useTheme();
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not logged in');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${BASE_URL}/api/BlogPosts/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: Post = await response.json();
        setPost(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load post.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostError(null);

    if (!newComment.trim()) {
      setPostError('Comment cannot be empty.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setPostError('User not logged in');
      return;
    }

    setPosting(true);
    try {
      const response = await fetch(`${BASE_URL}/api/Comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blogPostId: id,
          content: newComment.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send comment. Status: ${response.status}`);
      }

      const createdComment: Comment = await response.json();

      setPost(prev => {
        if (!prev) return prev;
        const updatedComments = prev.comments ? [createdComment, ...prev.comments] : [createdComment];
        return { ...prev, comments: updatedComments };
      });
      setNewComment('');
    } catch (err: any) {
      setPostError(err.message || 'Error occurred while sending comment.');
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setPostError('Not logged in.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/Comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment.');
      }

      setPost(prev => {
        if (!prev) return prev;
        const updatedComments = prev.comments?.filter(c => c.id !== commentId);
        return { ...prev, comments: updatedComments };
      });
    } catch (err: any) {
      setPostError(err.message || 'Error occurred while deleting.');
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleEditSubmit = async (commentId: string) => {
    if (!editingContent.trim()) {
      setPostError('Comment cannot be empty.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setPostError('Not logged in.');
      return;
    }

    if (!post) {
      setPostError('Post data missing.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/Comments/${commentId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editingContent.trim(),
          blogPostId: post.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update comment.');
      }

      const updated: Comment = await response.json();

      setPost(prev => {
        if (!prev) return prev;
        const updatedComments = prev.comments?.map(c =>
          c.id === commentId ? { ...c, content: updated.content } : c
        );
        return { ...prev, comments: updatedComments };
      });

      setEditingCommentId(null);
      setEditingContent('');
      setPostError(null);
    } catch (err: any) {
      setPostError(err.message || 'Error occurred while updating.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading post...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Error: {error}</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div style={{ maxWidth: 700, margin: 'auto' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textTransform: 'uppercase',
          fontSize: {
            xs: '1.6rem',
            sm: '2.5rem',
            md: '3rem',
          },
          textAlign: {
            xs: 'center',
          },
          px: {
            xs: 2,
            sm: 0,
          },
          wordBreak: 'break-word',
          hyphens: 'auto',
        }}
      >
        {post.title}
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
        <em>Author: {post.user ? `${post.user.firstname} ${post.user.lastname}` : 'Unknown'}</em>
      </Typography>

      <img
        src={post.imageUrl ? `${BASE_URL}${post.imageUrl}` : 'https://dummyimage.com/700x400/cccccc/000000&text=No+Image'}
        alt={post.title}
        style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8 }}
      />

      <Typography
        variant="body1"
        sx={{
          whiteSpace: 'pre-wrap',
          mt: 2,
          fontSize: {
            xs: '0.9rem',
            sm: '1rem',
            md: '1.1rem',
          },
          px: {
            xs: 2,
            sm: 0,
          },
          textAlign: {
            xs: 'justify',
            sm: 'left',
          },
          textAlignLast: {
            xs: 'left',
          },
          wordBreak: 'break-word',
          hyphens: 'auto',
        }}
      >
        {post.content}
      </Typography>

      <Divider sx={{ marginTop: 5, marginBottom: 2 }} />
      <Typography variant="h5" gutterBottom>Comments</Typography>

      {post.comments && post.comments.length > 0 ? (
        post.comments.map(comment => {
          const isOwnComment = comment.user?.id === currentUserId;

          return (
            <Paper key={comment.id} elevation={2} sx={{
              padding: 2,
              marginBottom: 2,
              backgroundColor: theme.palette.background.paper,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              position: 'relative',
            }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {comment.user ? `${comment.user.firstname} ${comment.user.lastname}` : 'Anonymous'}
              </Typography>

              {editingCommentId === comment.id ? (
                <Box>
                  <TextField
                    multiline
                    fullWidth
                    rows={2}
                    value={editingContent}
                    onChange={e => setEditingContent(e.target.value)}
                    sx={{ my: 1 }}
                  />
                  <Button size="small" onClick={() => handleEditSubmit(comment.id)} variant="contained">
                    Save
                  </Button>
                  <Button size="small" onClick={() => setEditingCommentId(null)} sx={{ ml: 1 }}>
                    Cancel
                  </Button>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {comment.content}
                </Typography>
              )}

              {isOwnComment && editingCommentId !== comment.id && (
                <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined" onClick={() => handleEdit(comment)}>Edit</Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(comment.id)}>Delete</Button>
                </Box>
              )}
            </Paper>
          );
        })
      ) : (
        <Typography variant="body1" color="text.secondary">No comments yet.</Typography>
      )}

      <Box component="form" onSubmit={handleCommentSubmit} sx={{ marginTop: 4 }}>
        <Typography variant="h6" gutterBottom>Add New Comment</Typography>

        <TextField
          label="Write your comment"
          multiline
          rows={4}
          fullWidth
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          variant="outlined"
          disabled={posting}
        />

        {postError && (
          <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
            {postError}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={posting}
          sx={{ marginTop: 2 }}
        >
          {posting ? 'Sending...' : 'Send Comment'}
        </Button>
      </Box>
    </div>
  );
};

export default PostDetail;
