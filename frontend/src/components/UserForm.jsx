import React from 'react';
import { useEffect, useState } from 'react';

const initialForm = { name: '', email: '', age: '', city: '', isActive: true };

function UserForm({ editingUser, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!editingUser) {
      setForm(initialForm);
      return;
    }

    setForm({
      name: editingUser.name || '',
      email: editingUser.email || '',
      age: String(editingUser.age || ''),
      city: editingUser.city || '',
      isActive: Boolean(editingUser.isActive)
    });
  }, [editingUser]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ ...form, age: Number(form.age) });
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{editingUser ? 'Edit User' : 'Create User'}</h2>

      <label>Name<input name="name" value={form.name} onChange={handleChange} required minLength={2} /></label>
      <label>Email<input name="email" type="email" value={form.email} onChange={handleChange} required /></label>
      <label>Age<input name="age" type="number" value={form.age} onChange={handleChange} min={1} max={120} required /></label>
      <label>City<input name="city" value={form.city} onChange={handleChange} /></label>

      <label className="check">
        <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} /> Active user
      </label>

      <div className="actions">
        <button type="submit">{editingUser ? 'Update' : 'Create'}</button>
        {editingUser ? <button type="button" className="ghost" onClick={onCancel}>Cancel</button> : null}
      </div>
    </form>
  );
}

export default UserForm;
