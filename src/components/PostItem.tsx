import React from 'react';
import { Card, CardMedia, CardContent, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface PostItemProps {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
}

const PostItem: React.FC<PostItemProps> = ({ id, title, content, imageUrl }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/post/${id}`);
  };

  return (
    <Card
      sx={{ width: 300, height: 250, display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
      onClick={handleClick}
    >
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
