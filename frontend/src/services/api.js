import axios from "axios";

// In dev the Vite proxy forwards /api -> http://localhost:5000
// In production set VITE_API_URL (e.g. https://my-api.com/api)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Unwrap { success, data } and turn server messages into readable Errors
const unwrap = (promise) =>
  promise
    .then((res) => res.data.data)
    .catch((err) => {
      throw new Error(
        err.response?.data?.message || "Cannot reach the server. Is the backend running?"
      );
    });

export const getBookmarks = (params = {}) => {
  const query = {};
  if (params.tag && params.tag !== "all") query.tag = params.tag;
  if (params.search) query.search = params.search;
  if (params.favorite) query.favorite = true;
  return unwrap(api.get("/bookmarks", { params: query }));
};

export const getTags = () => unwrap(api.get("/bookmarks/tags"));
export const createBookmark = (data) => unwrap(api.post("/bookmarks", data));
export const updateBookmark = (id, data) => unwrap(api.put(`/bookmarks/${id}`, data));
export const toggleFavorite = (id) => unwrap(api.patch(`/bookmarks/${id}/favorite`));
export const deleteBookmark = (id) => unwrap(api.delete(`/bookmarks/${id}`));
