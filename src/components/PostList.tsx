import React, { useState, useEffect } from 'react';
import PostItem from './PostItem';
import { Grid } from '@mui/material';

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
}


const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchPosts = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Kullanıcı girişi yapılmamış');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://localhost:7171/api/BlogPosts?pageNumber=1&pageSize=1000', {
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
}, []);


  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading posts...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Error: {error}</div>;

  return (
    <Grid container spacing={3} justifyContent="center" gap={5}>

      {posts.map((post) => (
  <Grid item xs={12} sm={6} md={4} key={post.id}>
    <PostItem
      id={post.id}  // burası önemli
      title={post.title}
      content={post.content}
      imageUrl={post.imageUrl || 'https://dummyimage.com/400x225/cccccc/000000&text=No+Image'}
    />
  </Grid>
))}
    </Grid>
  );
};

export default PostList;
