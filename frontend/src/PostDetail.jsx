import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from './api';

export default function PostDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [text, setText] = useState('');

  const load = () => api.get(`/api/posts/${id}`).then((res) => setPost(res.data));

  useEffect(() => { load(); }, [id]);

  const addComment = async (e) => {
    e.preventDefault();
    await api.post(`/api/posts/${id}/comments`, { comment: text });
    setText('');
    load();
  };

  const deletePost = async () => {
    if (!window.confirm('Delete this post?')) return;
    await api.delete(`/api/posts/${id}`);
    navigate('/');
  };

  const deleteComment = async (commentId) => {
    await api.delete(`/api/comments/${commentId}`);
    load();
  };

  if (!post) return <p>Loading...</p>;

  const isAdmin = user?.role === 'admin';
  const isPostOwner = user?.id === post.user_id;
  const canManagePost = isPostOwner || isAdmin;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>by {post.user?.name}</p>
      <p>{post.content}</p>
      {canManagePost && (
        <>
          <Link to={`/posts/${id}/edit`}>Edit</Link>
          <button onClick={deletePost}>Delete</button>
        </>
      )}

      <h3>Comments</h3>
      {post.comments.map((c) => (
        <div key={c.id}>
          <b>{c.user?.name ?? 'Guest'}:</b> {c.comment}
          {user && (user.id === c.user_id || canManagePost) && (
            <button onClick={() => deleteComment(c.id)}>Delete</button>
          )}
        </div>
      ))}

      <form onSubmit={addComment}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} required />
        <button type="submit">Add comment</button>
      </form>
    </div>
  );
}