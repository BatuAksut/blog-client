import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  CircularProgress,
  useTheme
} from '@mui/material';

const PostAdd: React.FC = () => {
  const theme = useTheme();  // <--- Temayı aldık
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Önce giriş yapmalısın!');
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
        throw new Error(errorData.message || 'Post ekleme başarısız oldu.');
      }

      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
        backgroundColor: theme.palette.background.paper,  // tema uyumlu arka plan
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        color: theme.palette.text.primary,  // tema uyumlu yazı rengi
      }}
    >
      <Typography variant="h5" component="h1" textAlign="center" mb={2}>
        Yeni Post Ekle
      </Typography>
      
      <TextField 
        label="Başlık" 
        variant="outlined" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        required 
        InputLabelProps={{ style: { color: theme.palette.text.primary } }}
        inputProps={{ style: { color: theme.palette.text.primary } }}
      />
      
      <TextField 
        label="İçerik" 
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
        {image ? 'Resim Seçildi' : 'Resim Yükle'}
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
        <Button variant="contained" disabled sx={{ mt: 1 }}>
          <CircularProgress size={24} color="inherit" />
          &nbsp;Ekleniyor...
        </Button>
      ) : (
        <Button type="submit" variant="contained" sx={{ mt: 1 }}>
          Postu Ekle
        </Button>
      )}

      {error && (
        <Typography color="error" mt={1} textAlign="center" sx={{ color: theme.palette.error.main }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default PostAdd;
