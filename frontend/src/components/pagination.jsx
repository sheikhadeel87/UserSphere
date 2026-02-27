import React from "react";

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [...Array(totalPages).keys()].map(n => n + 1);

  return (
    <div className="custom-pagination" style={{ marginTop: '18px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '8px' }}>
      <button
        className={`pg-btn${page === 1 ? ' disabled' : ''}`}
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        &#8592; Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={`pg-btn${p === page ? ' active' : ''}`}
          onClick={() => onPageChange(p)}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}
      <button
        className={`pg-btn${page === totalPages ? ' disabled' : ''}`}
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        Next &#8594;
      </button>
    </div>
  );
};

export default Pagination;