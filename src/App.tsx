import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

import Header from './components/Header';
import Footer from './components/Footer';
import PostList from './components/PostList';
import Login from './components/Login';
import Register from './components/Register';
import PostDetail from './components/PostDetail';
import PostAdd from './components/PostAdd';
import EditPost from './components/EditPost';



function App() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: mode,
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      h1: {
        fontFamily: 'Merriweather, serif',
      },
      body1: {
        fontFamily: 'Inter, sans-serif',
      }
    },
  }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header mode={mode} toggleMode={() => setMode(mode === 'light' ? 'dark' : 'light')} />

          <main style={{ flexGrow: 1, padding: '1rem', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <Routes>
              <Route path="/" element={<PostList />} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/add-post" element={<PostAdd />} />
              <Route path="/posts/edit/:id" element={<EditPost />} />
            </Routes>
          </main>
          <Footer mode={mode} />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
