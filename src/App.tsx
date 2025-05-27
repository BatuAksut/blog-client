import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';


import Header from './components/Header';
import Footer from './components/Footer';
import PostList from './components/PostList';
import Login from './components/Login';
import PostDetail from './components/PostDetail';
import PostAdd from './components/PostAdd';

const About: React.FC = () => (
  <div style={{ padding: '2rem' }}>
    <h2>About</h2>
    <p>This is the about page.</p>
  </div>
);

const Contact: React.FC = () => (
  <div style={{ padding: '2rem' }}>
    <h2>Contact</h2>
    <p>This is the contact page.</p>
  </div>
);

function App() {
  // localStorage'dan oku, yoksa 'light' kullan
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode === 'dark' ? 'dark' : 'light';
  });

  // mode değişince localStorage'a kaydet
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
}
,
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
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/add-post" element={<PostAdd />} />

            </Routes>
          </main>
          <Footer mode={mode} />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
