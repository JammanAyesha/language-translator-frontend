import { useEffect, useState } from "react";
import API from "../services/api";
import LogoutButton from "../components/LogoutButton";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const PAGE_SIZE = 5;

  useEffect(() => {
    setLoading(true);

    API.get(`favorites/?page=${page}`)
      .then((res) => {
        setFavorites(res.data.results);
        setCount(res.data.count);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this favorite?"))
      return;

    try {
      await API.delete(`favorites/${id}/`);
      setFavorites(favorites.filter((fav) => fav.id !== id));
      setCount(count - 1);
    } catch (err) {
      console.error(err);
      alert("Failed to delete favorite");
    }
  };

  const filteredFavorites = favorites.filter(
    (fav) =>
      fav.original_text.toLowerCase().includes(search.toLowerCase()) ||
      fav.translated_text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end mb-3">
        <LogoutButton />
      </div>

      <h4>⭐ Favorites</h4>

      <input
        type="text"
        className="form-control my-3"
        placeholder="Search favorites..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p>Loading...</p>}

      {!loading && filteredFavorites.length === 0 && (
        <p>No favorites found.</p>
      )}

      {filteredFavorites.map((fav) => (
        <div
          key={fav.id}
          className="card mb-2 p-3 d-flex flex-row justify-content-between align-items-center"
        >
          <div>
            <strong>{fav.original_text}</strong>
            <div className="text-muted">{fav.translated_text}</div>
            <small>
              {fav.source_language} → {fav.target_language}
            </small>
          </div>

          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => handleDelete(fav.id)}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      ))}

      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-outline-primary"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          ⬅ Previous
        </button>

        <span>
          Page {page} of {Math.ceil(count / PAGE_SIZE)}
        </span>

        <button
          className="btn btn-outline-primary"
          disabled={page >= Math.ceil(count / PAGE_SIZE)}
          onClick={() => setPage(page + 1)}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}

export default FavoritesPage;
