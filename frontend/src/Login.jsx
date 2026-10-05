import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { csrf } from './api';

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await csrf();
      await api.post('/api/login', form);
      const { data } = await api.get('/api/user');
      setUser(data);
      navigate('/');
    } catch {
      setError('Login failed. Check email and password.');
    }
  };

  return (
    <form onSubmit={submit}>
      <h1>Login</h1>
      <input type="email" placeholder="Email" value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <input type="password" placeholder="Password" value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
    </form>
  );
}