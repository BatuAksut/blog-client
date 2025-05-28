import React from 'react';
import { Card, CardMedia, CardContent, Typography, useTheme, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

interface PostItemProps {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  onDelete: (id: string) => void; // Yeni prop
}

const PostItem: React.FC<PostItemProps> = ({ id, title, content, imageUrl, onDelete }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/post/${id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Kart tıklamasını engelle
    onDelete(id);
  };

  return (
    <Card
      sx={{ width: 300, height: 250, display: 'flex', flexDirection: 'column', cursor: 'pointer', position: 'relative' }}
      onClick={handleClick}
    >
      <IconButton
        aria-label="delete"
        onClick={handleDeleteClick}
        sx={{ position: 'absolute', top: 5, right: 5, zIndex: 10 }}
      >
        <DeleteIcon />
      </IconButton>
      <CardMedia component="img" height="140" image={imageUrl} alt={title} />
      <CardContent sx={{ flex: 1, overflow: 'hidden' }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          color={theme.palette.text.primary}
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
    </Card>
  );
};

export default PostItem;
