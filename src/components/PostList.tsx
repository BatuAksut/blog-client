import React, { useState, useEffect } from 'react';
import PostItem from './PostItem';
import { Grid } from '@mui/material';

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
}

const BASE_URL = "https://localhost:7171";

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('Kullanıcı girişi yapılmamış');
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/BlogPosts?pageNumber=1&pageSize=1000`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!token) {
      alert('Kullanıcı girişi yapılmamış');
      return;
    }

    if (!window.confirm('Bu postu silmek istediğine emin misin')) return;

    try {
      const response = await fetch(`${BASE_URL}/api/BlogPosts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status === 204) {
        // Başarılı silme, state'ten çıkar
        setPosts(posts.filter(post => post.id !== id));
      } else if (response.status === 403) {
        alert('Bu işlemi yapmaya yetkin yok');
      } else if (response.status === 404) {
        alert('Post bulunamadı.');
      } else {
        alert('Post silinirken bir hata oluştu.');
      }
    } catch (err) {
      alert('Sunucuya bağlanırken hata oldu.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading posts...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Error: {error}</div>;

  return (
    <Grid container spacing={3} justifyContent="center" gap={5}>
      {posts.map((post) => (
        <Grid item xs={12} sm={6} md={4} key={post.id}>
          <PostItem
            id={post.id}
            title={post.title}
            content={post.content}
            imageUrl={post.imageUrl ? `${BASE_URL}${post.imageUrl}` : 'https://dummyimage.com/400x225/cccccc/000000&text=No+Image'}
            onDelete={handleDelete} // Yeni prop
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default PostList;
