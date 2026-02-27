import React from "react";

function Searchbar({
  filterSearch,
  setFilterSearch,
  filterAgeFrom,
  setFilterAgeFrom,
  filterAgeTo,
  setFilterAgeTo,
  filterIsActive,
  setFilterIsActive,
  loadFilteredUsers,
  variant = "default", // "default" | "toolbar"
}) {
  const isToolbar = variant === "toolbar";

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        loadFilteredUsers();
      }}
      className={`filter-form searchbar-compact${isToolbar ? " searchbar-toolbar" : ""}`}
    >
      <div className="searchbar-field">
        {!isToolbar && <label htmlFor="search">Search (name, email, city)</label>}
        <input
          id="search"
          type="text"
          value={filterSearch}
          onChange={e => setFilterSearch(e.target.value)}
          autoComplete="off"
          className="searchbar-input"
          placeholder={isToolbar ? "Search name, email, city…" : "Search by name, email or city"}
          aria-label="Search by name, email or city"
        />
      </div>

      <div className="searchbar-field">
        {!isToolbar && <label htmlFor="ageRange">Age range</label>}
        <input
          id="ageRange"
          type="text"
          value={
            filterAgeFrom && filterAgeTo
              ? `${filterAgeFrom}-${filterAgeTo}`
              : filterAgeFrom
                ? `${filterAgeFrom}-`
                : filterAgeTo
                  ? `-${filterAgeTo}`
                  : ''
          }
          onChange={e => {
            const val = e.target.value.replace(/\s/g, '');
            const match = val.match(/^(\d+)?[-to,/]*(\d+)?$/i);
            if (match) {
              setFilterAgeFrom(match[1] || '');
              setFilterAgeTo(match[2] || '');
            } else {
              setFilterAgeFrom('');
              setFilterAgeTo('');
            }
          }}
          placeholder="Age (e.g. 20-30)"
          autoComplete="off"
          className="searchbar-input"
          aria-label="Age range"
        />
      </div>

      <div className="searchbar-field">
        {!isToolbar && <label htmlFor="isActive">Status</label>}
        <select
          id="isActive"
          value={filterIsActive}
          onChange={e => setFilterIsActive(e.target.value)}
          autoComplete="off"
          className="searchbar-input"
          aria-label="Status filter"
        >
          <option value="">All status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <div className={`searchbar-field ${isToolbar ? "" : "searchbar-field-btn"}`}>
        {!isToolbar && <label className="searchbar-label-invisible" aria-hidden="true">Action</label>}
        <button type="submit" className="searchbar-btn">
          {isToolbar ? "Apply" : "Search"}
        </button>
      </div>
    </form>
  );
}

export default Searchbar;