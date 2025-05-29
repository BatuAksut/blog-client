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

  const handleClick = () => {
    navigate(`/post/${id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/posts/edit/${id}`);
  };

  return (
    <Card
      sx={{
        width: 300,
        height: 300,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
      }}
      onClick={handleClick}
    >
      <Box sx={{ position: 'absolute', top: 5, right: 5, zIndex: 10, display: 'flex', gap: 1 }}>
        <IconButton aria-label="edit" onClick={handleEditClick}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={handleDeleteClick}>
          <DeleteIcon />
        </IconButton>
      </Box>

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
    </Card>
  );
};

export default PostItem;
