import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from './api';

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      api.get(`/api/posts/${id}/edit`).then((res) =>
        setForm({ title: res.data.title, content: res.data.content })
      );
    }
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (id) {
        await api.put(`/api/posts/${id}`, form);
        navigate(`/posts/${id}`);
      } else {
        const { data } = await api.post('/api/posts', form);
        navigate(`/posts/${data.id}`);
      }
    } catch {
      setError('Could not save. Login first and check that all fields are filled.');
    }
  };

  return (
    <form onSubmit={submit}>
      <h1>{id ? 'Edit post' : 'New post'}</h1>
      <input placeholder="Title" value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      <textarea placeholder="Content" value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })} required />
      <button type="submit">Save</button>
      {error && <p>{error}</p>}
    </form>
  );
}