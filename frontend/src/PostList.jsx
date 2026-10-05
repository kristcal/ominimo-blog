import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from './api';

export default function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/api/posts').then((res) => setPosts(res.data));
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2><Link to={`/posts/${post.id}`}>{post.title}</Link></h2>
          <p>by {post.user?.name}</p>
        </div>
      ))}
    </div>
  );
}