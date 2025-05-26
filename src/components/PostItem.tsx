import React from 'react';
import { Card, CardMedia, CardContent, Typography, useTheme } from '@mui/material';

interface PostItemProps {
  title: string;
  content: string;
  imageUrl: string;
}

const PostItem: React.FC<PostItemProps> = ({ title, content, imageUrl }) => {
  const theme = useTheme();

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={imageUrl}
        alt={title}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" color={theme.palette.text.primary}>
          {title}
        </Typography>
        <Typography variant="body2" color={theme.palette.text.secondary}>
          {content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PostItem;
