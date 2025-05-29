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
  Typography,
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

  const token = localStorage.getItem('token');
  const firstname = localStorage.getItem('firstname');
  const lastname = localStorage.getItem('lastname');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
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
        {/* Logo + Tema Değiştirici */}
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

        {/* Menü */}
        {!isMobile ? (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {token && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/add-post')}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                New Post
              </Button>
            )}

            {token && firstname && lastname && (
              <Typography
                sx={{
                  fontWeight: 600,
                  color: mode === 'dark' ? '#e0e0e0' : '#333',
                }}
              >
                Welcome, {firstname} {lastname}
              </Typography>
            )}

            {token ? (
              <Button
                onClick={handleLogout}
                color="error"
                variant="contained"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="outlined"
                  color="primary"
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Register
                </Button>
              </>
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
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <List sx={{ width: 200, backgroundColor: theme.palette.background.paper }}>
                {token && (
                  <ListItem
                    button
                    component={Link}
                    to="/add-post"
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemText
                      primary="New Post"
                      primaryTypographyProps={{
                        color:
                          theme.palette.mode === 'dark'
                            ? theme.palette.primary.light
                            : theme.palette.primary.main,
                        fontWeight: 600,
                      }}
                    />
                  </ListItem>
                )}

                {token && firstname && lastname && (
                  <ListItem>
                    <ListItemText
                      primary={`Welcome, ${firstname} ${lastname}`}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        color: theme.palette.text.secondary,
                      }}
                    />
                  </ListItem>
                )}

                {token ? (
                  <ListItem
                    button
                    onClick={() => {
                      handleLogout();
                      setDrawerOpen(false);
                    }}
                  >
                    <ListItemText
                      primary="Logout"
                      primaryTypographyProps={{
                        color: theme.palette.error.main,
                        fontWeight: 600,
                      }}
                    />
                  </ListItem>
                ) : (
                  <>
                    <ListItem
                      button
                      component={Link}
                      to="/login"
                      onClick={() => setDrawerOpen(false)}
                    >
                      <ListItemText
                        primary="Login"
                        primaryTypographyProps={{
                          color:
                            theme.palette.mode === 'dark'
                              ? theme.palette.primary.light
                              : theme.palette.primary.main,
                          fontWeight: 600,
                        }}
                      />
                    </ListItem>
                    <ListItem
                      button
                      component={Link}
                      to="/register"
                      onClick={() => setDrawerOpen(false)}
                    >
                      <ListItemText
                        primary="Register"
                        primaryTypographyProps={{
                          color:
                            theme.palette.mode === 'dark'
                              ? theme.palette.primary.light
                              : theme.palette.primary.main,
                          fontWeight: 600,
                        }}
                      />
                    </ListItem>
                  </>
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
