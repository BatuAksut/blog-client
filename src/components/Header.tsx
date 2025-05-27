import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Menu } from 'lucide-react';
import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Brightness4, Brightness7 } from '@mui/icons-material';

interface HeaderProps {
  mode: 'light' | 'dark';
  toggleMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ mode, toggleMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = ['Home', 'About', 'Contact'];
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header
      style={{
        backgroundColor: theme.palette.background.paper,
        boxShadow:
          mode === 'light'
            ? '0 2px 4px rgba(0, 0, 0, 0.1)'
            : '0 2px 4px rgba(0, 0, 0, 0.6)',
        borderBottom:
          mode === 'light'
            ? '1px solid rgba(0, 0, 0, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(4px)',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Sol taraf: Logo + Dark mode toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '1.5rem',
              fontWeight: 600,
              color: theme.palette.text.primary,
              textDecoration: 'none',
            }}
          >
            <BookOpen style={{ marginRight: 8 }} size={30} />
            MinimaLog
          </Link>

          <IconButton onClick={toggleMode} color="inherit">
            {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </div>

        {/* Sağ taraf: Menü + PostAdd (giriş varsa) */}
        {!isMobile ? (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <ul
              style={{
                display: 'flex',
                gap: '1.5rem',
                listStyle: 'none',
                margin: 0,
                padding: 0,
              }}
            >
              {navItems.map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    style={{
                      color: theme.palette.text.secondary,
                      textDecoration: 'none',
                    }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Eğer token varsa PostAdd butonu göster */}
            {token && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/add-post')}
              >
                Yeni Post
              </Button>
            )}

            {token ? (
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: theme.palette.error.main,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: theme.palette.primary.main,
                  color: '#fff',
                  borderRadius: '4px',
                  textDecoration: 'none',
                }}
              >
                Login
              </Link>
            )}
          </nav>
        ) : (
          <>
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ color: theme.palette.text.primary }}
            >
              <Menu />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <List sx={{ width: 200, backgroundColor: theme.palette.background.paper }}>
                {navItems.map((item) => (
                  <ListItem
                    button
                    key={item}
                    component={Link}
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemText
                      primary={item}
                      primaryTypographyProps={{ color: theme.palette.text.primary }}
                    />
                  </ListItem>
                ))}

                {/* Mobilde de giriş varsa yeni post linki */}
                {token && (
                  <ListItem
                    button
                    component={Link}
                    to="/add-post"
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemText primary="Yeni Post" />
                  </ListItem>
                )}

                {token ? (
                  <ListItem button onClick={() => {
                    handleLogout();
                    setDrawerOpen(false);
                  }}>
                    <ListItemText primary="Logout" />
                  </ListItem>
                ) : (
                  <ListItem
                    button
                    component={Link}
                    to="/login"
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemText primary="Login" />
                  </ListItem>
                )}
              </List>
            </Drawer>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
