import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  useTheme,
  IconButton,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface PostItemProps {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  onDelete: (id: string) => void;
}

const PostItem: React.FC<PostItemProps> = ({ id, title, content, imageUrl, onDelete }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const handleClick = () => {
    navigate(`/post/${id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) {
      alert('Please log in to continue');
      return;
    }
    onDelete(id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) {
      alert('Please log in to continue');
      return;
    }
    navigate(`/posts/edit/${id}`);
  };

  return (
    <Card
      sx={{
        width: 330,
        height: 360,
        border: (theme) =>
          theme.palette.mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.18)'
            : '1px solid rgba(255, 255, 255, 0.3)',

        background:
          (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(255, 255, 255, 0.7)',

        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',

        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        boxShadow:
          (theme) =>
            theme.palette.mode === 'dark'
              ? '0 4px 12px rgba(255, 255, 255, 0.1)'
              : '0 4px 12px rgba(0, 0, 0, 0.1)',

        transition: 'transform 0.35s ease-in-out, box-shadow 0.35s ease-in-out, background 0.35s ease-in-out',

        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow:
            (theme) =>
              theme.palette.mode === 'dark'
                ? '0 12px 36px rgba(255, 255, 255, 0.3)'
                : '0 12px 36px rgba(0, 0, 0, 0.2)',
          background:
            (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.12)'
                : 'rgba(255, 255, 255, 0.85)',
        },
      }}
      onClick={handleClick}
    >
      <CardMedia component="img" height="140" image={imageUrl} alt={title} />

      <CardContent sx={{ flex: 1, overflow: 'hidden' }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          color={theme.palette.text.primary}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color={theme.palette.text.secondary}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {content}
        </Typography>
      </CardContent>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, gap: 1 }} onClick={(e) => e.stopPropagation()}>
        <IconButton aria-label="edit" onClick={handleEditClick}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={handleDeleteClick}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
};

export default PostItem;
