import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  CircularProgress,
  useTheme,
  Snackbar,
  Alert,
} from '@mui/material';

const PostAdd: React.FC = () => {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must log in first!');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://localhost:7171/api/BlogPosts/with-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add post.');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSuccess(false);
    navigate('/'); // Başarılı post ekledikten sonra anasayfaya git
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{ 
        maxWidth: 500, 
        mx: 'auto', 
        mt: 4, 
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h5" component="h1" textAlign="center" mb={2}>
        Add New Post
      </Typography>
      
      <TextField 
        label="Title" 
        variant="outlined" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        required 
        InputLabelProps={{ style: { color: theme.palette.text.primary } }}
        inputProps={{ style: { color: theme.palette.text.primary } }}
      />
      
      <TextField 
        label="Content" 
        variant="outlined" 
        multiline 
        rows={6} 
        value={content} 
        onChange={e => setContent(e.target.value)} 
        required 
        InputLabelProps={{ style: { color: theme.palette.text.primary } }}
        inputProps={{ style: { color: theme.palette.text.primary } }}
      />
      
      <Button
        variant="contained"
        component="label"
      >
        {image ? 'Image Selected' : 'Upload Image'}
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={e => {
            const file = e.target.files?.[0];
            setImage(file || null);
          }}
        />
      </Button>
      
      {loading ? (
        <Button variant="contained" disabled sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <CircularProgress size={24} color="inherit" />
          Uploading...
        </Button>
      ) : (
        <Button type="submit" variant="contained" sx={{ mt: 1 }}>
          Add Post
        </Button>
      )}

      {error && (
        <Typography color="error" mt={1} textAlign="center" sx={{ color: theme.palette.error.main }}>
          {error}
        </Typography>
      )}

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
            maxWidth: '500px',
            mx: 'auto',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            p: 2,
            textAlign: 'center',
          }}
        >
          Post created successfully! 🎉
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PostAdd;
