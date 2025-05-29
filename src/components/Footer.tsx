// Footer.tsx
import React from 'react';
import { useTheme } from '@mui/material/styles';

interface FooterProps {
  mode: 'light' | 'dark';
}

const Footer: React.FC<FooterProps> = ({ mode }) => {
  const theme = useTheme();

  return (
    <footer style={{
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.secondary,
      padding: '1rem 0',
      marginTop: 'auto',
      textAlign: 'center',
      borderTop: `1px solid ${theme.palette.divider}`,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        &copy; {new Date().getFullYear()} MinimaLog. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
