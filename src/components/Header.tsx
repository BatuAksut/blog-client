import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Menu } from 'lucide-react';
import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
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

  const navItems = ['Home', 'About', 'Contact'];

  return (
    <header
      style={{
        backgroundColor: theme.palette.background.paper,
         boxShadow:
      mode === 'light'
        ? '0 2px 4px rgba(0, 0, 0, 0.1)' // Light mode gölge
        : '0 2px 4px rgba(0, 0, 0, 0.6)', // Dark mode daha belirgin
    borderBottom: `1px solid ${
      mode === 'light'
        ? 'rgba(0, 0, 0, 0.1)'
        : 'rgba(255, 255, 255, 0.1)'
    }`, // Alt çizgiyle ayrım
    backdropFilter: 'blur(4px)', // Hafif transparanlık için
    position: 'sticky',
    top: 0,
    zIndex: 1100, // Üstte dursun
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

        {/* Sağ taraf: Menü */}
        {!isMobile ? (
          <nav>
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
</List>

            </Drawer>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
