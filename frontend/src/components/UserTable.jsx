import React, { useState } from 'react';
import UserForm from './UserForm';
import Searchbar from './Searchbar';
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Pencil, Trash2 } from "lucide-react";

function UserTable({
  users,
  onDelete,
  sortField,
  sortOrder,
  onSort,
  onCreateUser,
  onUpdateUser,
  filterSearch,
  setFilterSearch,
  filterAgeFrom,
  setFilterAgeFrom,
  filterAgeTo,
  setFilterAgeTo,
  filterIsActive,
  setFilterIsActive,
  loadFilteredUsers,
}) {
  const [showModal, setShowModal] = useState(false);
  const [modalUser, setModalUser] = useState(null); // null for create, user object for edit

  function handleCreateUser() {
    setModalUser(null);
    setShowModal(true);
  }

  function handleEditUser(user) {
    setModalUser(user);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setModalUser(null);
  }

  async function handleUserFormSubmit(formData) {
    if (modalUser) {
      await onUpdateUser(modalUser._id, formData);
    } else {
      await onCreateUser(formData);
    }
    handleCloseModal();
  }
  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />;
  }
  const showSearchbar = typeof loadFilteredUsers === 'function';

  return (
    <div className="site-container">
      <div className="users-toolbar">
      <h2 className="report-title" style={{ fontSize: 28 }}>Users</h2>
        {showSearchbar && (
          <div className="users-toolbar-filters">
            <Searchbar
              variant="toolbar"
              filterSearch={filterSearch}
              setFilterSearch={setFilterSearch}
              filterAgeFrom={filterAgeFrom}
              setFilterAgeFrom={setFilterAgeFrom}
              filterAgeTo={filterAgeTo}
              setFilterAgeTo={setFilterAgeTo}
              filterIsActive={filterIsActive}
              setFilterIsActive={setFilterIsActive}
              loadFilteredUsers={loadFilteredUsers}
            />
          </div>
        )}
        <button
          type="button"
          className="users-toolbar-btn-primary"
          onClick={handleCreateUser}
        >
          Create User
        </button>
      </div>
      <div className="site-table-wrap">
        <table className="site-table">
          <thead>
            <tr>
              <th onClick={() => onSort('name')} style={{ cursor: 'pointer', color: sortField === 'name' ? '#0284c7' : undefined }}>
                Name {renderSortIcon('name')}
              </th>
              <th onClick={() => onSort('email')} style={{ cursor: 'pointer', color: sortField === 'email' ? '#0284c7' : undefined }}>
                Email {renderSortIcon('email')}
              </th>
              <th onClick={() => onSort('age')} style={{ cursor: 'pointer', color: sortField === 'age' ? '#0284c7' : undefined }}>
                Age {renderSortIcon('age')}
              </th>
              <th onClick={() => onSort('city')} style={{ cursor: 'pointer', color: sortField === 'city' ? '#0284c7' : undefined }}>
                City {renderSortIcon('city')}
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="6">No users found</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.age}</td>
                  <td>{user.city || '-'}</td>
                  <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                  <td>
                    <div className="actions">
                      <button className="icon-btn edit" onClick={() => handleEditUser(user)}>
                        <Pencil size={16} />
                      </button>
                      <button className="icon-btn delete" onClick={() => onDelete(user._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal for UserForm */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ borderRadius: 10, boxShadow: '0 4px 24px rgba(0,0,0,0.12)', padding: 24, minWidth: 340, maxWidth: '90vw', position: 'relative' }}>
            <button onClick={handleCloseModal} style={{ position: 'absolute', right: 25, background: 'transparent', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>&times;</button>
            <UserForm editingUser={modalUser} onSubmit={handleUserFormSubmit} onCancel={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default UserTable;
