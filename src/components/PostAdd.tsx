import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PostAdd: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Önce giriş yapmalısın reis!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://localhost:7171/api/BlogPosts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, imageUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Post ekleme başarısız oldu.');
      }

      // Başarılıysa anasayfaya yönlendir
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input
        type="text"
        placeholder="Başlık"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="İçerik"
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={6}
        required
      />
      <input
        type="text"
        placeholder="Görsel URL (opsiyonel)"
        value={imageUrl}
        onChange={e => setImageUrl(e.target.value)}
      />
      <button type="submit" disabled={loading}>{loading ? 'Ekleniyor...' : 'Postu Ekle'}</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default PostAdd;
