import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  useTheme
} from '@mui/material';


function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await fetch('https://localhost:7171/api/Auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Login failed');

    const data = await res.json();

   
    localStorage.setItem('token', data.jwtToken);


    const payload = parseJwt(data.jwtToken);
if (payload) {
  const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
  const usernameFromToken = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
  const firstname = payload["firstname"];
  const lastname = payload["lastname"];

  if (userId) localStorage.setItem("userId", userId);
  if (usernameFromToken) localStorage.setItem("username", usernameFromToken);
  if (firstname) localStorage.setItem("firstname", firstname);
  if (lastname) localStorage.setItem("lastname", lastname);
}


    navigate('/');
  } catch (err: any) {
    setError(err.message || 'An error occurred.');
  }
};


  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          mt: 8,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom align="center">
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            label="Email"
            variant="outlined"
            required
            fullWidth
          />
          <TextField
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            variant="outlined"
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
