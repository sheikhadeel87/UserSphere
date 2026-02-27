import React, { useEffect, useRef, useState } from 'react';
import UserForm from './components/UserForm';
import UserTable from './components/UserTable';
import StatsPanel from './components/StatsPanel';
import { usersApi } from './services/api';
import Pagination from './components/Pagination';
import { Routes, Route } from 'react-router-dom';
import Cities from './pages/Cities';
import GraphicalView from './pages/GraphicalView';
import DashboardLayout from './layout/DashboardLayout';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [filterIsActive, setFilterIsActive] = useState('');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCities, setTotalCities] = useState(0);
  const [cityNames, setCityNames] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const [ageFrom, setAgeFrom] = useState('');
  // const [ageTo, setAgeTo] = useState('');
  const [ageUsers, setAgeUsers] = useState([]);
  // const [filterName, setFilterName] = useState('');
  // const [filterCity, setFilterCity] = useState('');
  // const [filterEmail, setFilterEmail] = useState('');
  const [filterSearch, setFilterSearch] = useState('');
  const [filterAgeFrom, setFilterAgeFrom] = useState('');
  const [filterAgeTo, setFilterAgeTo] = useState('');
  // const [filterAge, setFilterAge] = useState(''); // Remove unused single age filter
  const [filterActive, setFilterActive] = useState('');
  // Removed filteredUsers state; use only users
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const searchDebounceRef = useRef(null);
  const hadSearchQueryRef = useRef(false);
  
  function handleSort(field) {
    let newOrder = 'asc';

    if (sortField === field) {
      newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    }

    setSortField(field);
    setSortOrder(newOrder);

    // Immediately call with fresh values
    loadUsers(1, field, newOrder);
  }

  async function loadUsers(pageNum = 1, field = sortField, order = sortOrder) {
    setLoading(true);
    setError('');

    try {
      const response = await usersApi.getUsers({
        page: pageNum,
        limit: 10,
        sort: (order === 'asc' ? '' : '-') + field
      });

      setUsers(response.data || []);
      setPage(response.meta?.page || 1);
      setTotalPages(response.meta?.totalPages || 1);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handlePageChange(newPage) {
    loadUsers(newPage);
  }

  async function loadStats() {
    try {
      const response = await usersApi.getStats();
      setStats(response.data || []);
    } catch {
      setStats([]);
    }
  }

  async function loadGeneralStats() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/users/general-stats`);
      const data = await response.json();

      setTotalUsers(data.totalUsers || 0);
      setTotalCities(data.totalCities || 0);
      setCityNames(data.cityNames || []);
    } catch {
      setTotalUsers(0);
      setTotalCities(0);
      setCityNames([]);
    }
  }

  useEffect(() => {
    loadUsers(page);
    loadStats();
    loadGeneralStats();
  }, [page]);

  async function handleCreateUser(formData) {
    setError('');
    try {
      await usersApi.createUser(formData);
      await Promise.all([loadUsers(), loadStats(), loadGeneralStats()]);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdateUser(userId, formData) {
    setError('');
    try {
      await usersApi.updateUser(userId, formData);
      await Promise.all([loadUsers(), loadStats(), loadGeneralStats()]);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this user?')) return;
    setError('');
    try {
      await usersApi.deleteUser(id);
      if (editingUser?._id === id) setEditingUser(null);
      await Promise.all([loadUsers(), loadStats(), loadGeneralStats()]);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadFilteredUsers() {
    setLoading(true);
    setError('');
    try {
      let url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/users/filter?`;
      if (filterSearch) url += `search=${encodeURIComponent(filterSearch)}&`;
      if (filterAgeFrom) url += `ageFrom=${filterAgeFrom}&`;
      if (filterAgeTo) url += `ageTo=${filterAgeTo}&`;
      if (filterIsActive) url += `isActive=${filterIsActive}&`;
      const res = await fetch(url);
      const data = await res.json();
      setUsers(data.data || []);
      setPage(1);
      setTotalPages(data.meta?.totalPages ?? 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // 3-letter prediction: when search has 3+ chars, run filter after debounce; when under 3, reset to full list
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    const trimmed = filterSearch.trim();
    if (trimmed.length >= 3) {
      hadSearchQueryRef.current = true;
      searchDebounceRef.current = setTimeout(() => loadFilteredUsers(), 350);
    } else if (hadSearchQueryRef.current) {
      hadSearchQueryRef.current = false;
      loadUsers(1);
    }
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [filterSearch]);

  async function loadUsersByAge() {
    let url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/users/byAge?`;
    if (ageFrom) url += `from=${ageFrom}&`;
    if (ageTo) url += `to=${ageTo}`;
    const res = await fetch(url);
    const data = await res.json();
    setAgeUsers(data.data || []);
  }
  return (
    <main className="container">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
            <DashboardLayout>
              <>
                <h1 className="page-title"></h1>

                {loading && <p className="banner">Loading...</p>}
                {error && <p className="banner error">{error}</p>}

                <section>
                  <StatsPanel
                    stats={stats}
                    totalUsers={totalUsers}
                    totalCities={totalCities}
                    cityNames={cityNames}
                  />
                </section>

                <UserTable
                  users={users}
                  onDelete={handleDelete}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  onCreateUser={handleCreateUser}
                  onUpdateUser={handleUpdateUser}
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

                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />

              </>
            </DashboardLayout> 
            </ProtectedRoute>
            } />


      <Route path="/cities" element={
      <DashboardLayout>
        <Cities />
      </DashboardLayout> }/>

       
     <Route path="/graphicalView" element={
      <DashboardLayout>
        <GraphicalView />
      </DashboardLayout> }/>


      <Route path="/users" element={
          <DashboardLayout>
            <Users
              users={users}
              onDelete={handleDelete}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
              onCreateUser={handleCreateUser}
              onUpdateUser={handleUpdateUser}
              filterSearch={filterSearch}
              setFilterSearch={setFilterSearch}
              filterAgeFrom={filterAgeFrom}
              setFilterAgeFrom={setFilterAgeFrom}
              filterAgeTo={filterAgeTo}
              setFilterAgeTo={setFilterAgeTo}
              filterIsActive={filterIsActive}
              setFilterIsActive={setFilterIsActive}
              loadFilteredUsers={loadFilteredUsers}
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </DashboardLayout> } />


        <Route path="/reports" element={
            <DashboardLayout>
              <Reports stats={stats} />
            </DashboardLayout> } />
      </Routes>
    </main>
  );
}

export default App;
