import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Kullanıcı girişi yapılmamış');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`https://localhost:7171/api/BlogPosts/${id}`, {
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
    fetchPost();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading post...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Error: {error}</div>;
  if (!post) return <div>Post bulunamadı.</div>;

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: '2rem' }}>
      <h1 style={{ textTransform: 'uppercase' }}>{post.title}</h1>
      <img src={post.imageUrl || 'https://dummyimage.com/700x400/cccccc/000000&text=No+Image'} alt={post.title} style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }} />
      <p style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>{post.content}</p>
    </div>
  );
};

export default PostDetail;
