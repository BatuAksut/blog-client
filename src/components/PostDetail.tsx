import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Kullanıcı girişi yapılmamış');
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
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostError(null);

    if (!newComment.trim()) {
      setPostError('Yorum boş olamaz.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setPostError('Kullanıcı girişi yapılmamış');
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
        throw new Error(`Yorum gönderilemedi. Status: ${response.status}`);
      }

      const createdComment: Comment = await response.json();

      setPost(prev => {
        if (!prev) return prev;
        const updatedComments = prev.comments ? [createdComment, ...prev.comments] : [createdComment];
        return { ...prev, comments: updatedComments };
      });
      setNewComment('');
    } catch (err: any) {
      setPostError(err.message || 'Yorum gönderirken hata oluştu.');
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading post...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>Error: {error}</div>;
  if (!post) return <div>Post bulunamadı.</div>;

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: '2rem' }}>
      <h1 style={{ textTransform: 'uppercase' }}>{post.title}</h1>
      <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
        <em>Yazar: {post.user ? `${post.user.firstname} ${post.user.lastname}` : 'Bilinmiyor'}</em>
      </p>
      <img
        src={post.imageUrl ? `${BASE_URL}${post.imageUrl}` : 'https://dummyimage.com/700x400/cccccc/000000&text=No+Image'}
        alt={post.title}
        style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }}
      />
      <p style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>{post.content}</p>

      <hr style={{ marginTop: '3rem', marginBottom: '1rem' }} />

      <h2>Yorumlar</h2>
      {post.comments && post.comments.length > 0 ? (
        post.comments.map(comment => (
          <div key={comment.id} style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #ccc', borderRadius: 4 }}>
            <p>
              <strong>{comment.user.firstname} {comment.user.lastname}</strong>
            </p>
            <p>{comment.content}</p>
          </div>
        ))
      ) : (
        <p>Henüz yorum yok.</p>
      )}

      <form onSubmit={handleCommentSubmit} style={{ marginTop: '2rem' }}>
        <h3>Yeni Yorum Ekle</h3>
        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          rows={4}
          style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
          placeholder="Yorumunuzu yazın..."
          disabled={posting}
        />
        {postError && <p style={{ color: 'red' }}>{postError}</p>}
        <button
          type="submit"
          disabled={posting}
          style={{
            marginTop: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: posting ? 'not-allowed' : 'pointer',
          }}
        >
          {posting ? 'Gönderiliyor...' : 'Yorumu Gönder'}
        </button>
      </form>
    </div>
  );
};

export default PostDetail;
