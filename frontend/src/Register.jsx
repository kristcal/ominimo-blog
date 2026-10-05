import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { csrf } from './api';

export default function Register({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await csrf();
      await api.post('/api/register', form);
      const { data } = await api.get('/api/user');
      setUser(data);
      navigate('/');
    } catch {
      setError('Registration failed. Check the fields.');
    }
  };

  return (
    <form onSubmit={submit}>
      <h1>Register</h1>
      <input placeholder="Name" value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input type="email" placeholder="Email" value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <input type="password" placeholder="Password" value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      <input type="password" placeholder="Confirm password" value={form.password_confirmation}
        onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} required />
      <button type="submit">Register</button>
      {error && <p>{error}</p>}
    </form>
  );
}