import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';

const BASE_URL = 'https://localhost:7171';

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token not found.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/api/BlogPosts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to load post.');

        const data = await response.json();
        setTitle(data.title);
        setContent(data.content);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token not found.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/BlogPosts/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) throw new Error('Failed to update post.');

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSuccess(false);
    navigate(`/post/${id}`);
  };

  if (loading) return <Box textAlign="center"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box component="form" onSubmit={handleSubmit} maxWidth={600} mx="auto" mt={4}>
      <Typography variant="h4" mb={3}>Edit Post</Typography>

      <TextField
        label="Title"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
      />

      <TextField
        label="Content"
        fullWidth
        multiline
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        margin="normal"
      />

      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={submitting}
        sx={{ mt: 2 }}
      >
        {submitting ? 'Saving...' : 'Save'}
      </Button>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{
            width: '100%',
            maxWidth: '600px',
            mx: 'auto',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            p: 2,
            textAlign: 'center',
          }}
        >
          Post updated successfully! 🚀
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditPost;
