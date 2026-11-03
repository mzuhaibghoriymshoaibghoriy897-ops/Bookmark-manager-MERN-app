import mongoose from "mongoose";
import Bookmark from "../models/Bookmark.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const notFound = (res) =>
  res.status(404).json({ success: false, message: "Bookmark not found" });

const badId = (res) =>
  res.status(400).json({ success: false, message: "Invalid bookmark id" });

// Escape user input before using it inside a RegExp (prevents regex injection)
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// POST /api/bookmarks
export const createBookmark = async (req, res, next) => {
  try {
    const { title, url, tag } = req.body;
    const bookmark = await Bookmark.create({ title, url, tag: tag || undefined });
    res.status(201).json({ success: true, data: bookmark });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookmarks?tag=react&search=hooks&favorite=true
export const getBookmarks = async (req, res, next) => {
  try {
    const { tag, search, favorite } = req.query;
    const filter = {};

    if (tag && tag !== "all") filter.tag = tag.toLowerCase();
    if (favorite === "true") filter.isFavorite = true;
    if (search && search.trim()) {
      filter.title = { $regex: escapeRegex(search.trim()), $options: "i" };
    }

    const bookmarks = await Bookmark.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: bookmarks.length, data: bookmarks });
  } catch (err) {
    next(err);
  }
};

// GET /api/bookmarks/tags  -> [{ tag: "react", count: 3 }, ...]
export const getTags = async (req, res, next) => {
  try {
    const tags = await Bookmark.aggregate([
      { $group: { _id: "$tag", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      { $project: { _id: 0, tag: "$_id", count: 1 } },
    ]);
    res.json({ success: true, data: tags });
  } catch (err) {
    next(err);
  }
};

// PUT /api/bookmarks/:id  (edit)
export const updateBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return badId(res);

    const { title, url, tag } = req.body;
    const bookmark = await Bookmark.findByIdAndUpdate(
      id,
      { title, url, tag: tag || "general" },
      { new: true, runValidators: true }
    );
    if (!bookmark) return notFound(res);

    res.json({ success: true, data: bookmark });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/bookmarks/:id/favorite  (toggle)
export const toggleFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return badId(res);

    const bookmark = await Bookmark.findById(id);
    if (!bookmark) return notFound(res);

    bookmark.isFavorite = !bookmark.isFavorite;
    await bookmark.save();

    res.json({ success: true, data: bookmark });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/bookmarks/:id
export const deleteBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return badId(res);

    const bookmark = await Bookmark.findByIdAndDelete(id);
    if (!bookmark) return notFound(res);

    res.json({ success: true, data: bookmark });
  } catch (err) {
    next(err);
  }
};
