import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import api from './api';
import Login from './Login';
import Register from './Register';
import PostList from './PostList';
import PostDetail from './PostDetail';
import PostForm from './PostForm';

function Nav({ user, onLogout }) {
  return (
    <nav style={{ display: 'flex', gap: 12 }}>
      <Link to="/">Blog</Link>
      {user ? (
        <>
          <Link to="/posts/new">New post</Link>
          <span>{user.name}</span>
          <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api.get('/api/user')
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  const logout = async () => {
    await api.post('/api/logout');
    setUser(null);
  };

  if (!ready) return <p>Loading...</p>;

  return (
    <BrowserRouter>
      <Nav user={user} onLogout={logout} />
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/new" element={<PostForm />} />
        <Route path="/posts/:id" element={<PostDetail user={user} />} />
        <Route path="/posts/:id/edit" element={<PostForm />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
      </Routes>
    </BrowserRouter>
  );
}