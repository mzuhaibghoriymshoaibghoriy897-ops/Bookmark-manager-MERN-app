import { Router } from "express";
import {
  createBookmark,
  getBookmarks,
  getTags,
  updateBookmark,
  toggleFavorite,
  deleteBookmark,
} from "../controllers/bookmarkController.js";

const router = Router();

router.route("/").get(getBookmarks).post(createBookmark);

// NOTE: keep /tags above /:id routes so "tags" is not treated as an id
router.get("/tags", getTags);

router.route("/:id").put(updateBookmark).delete(deleteBookmark);
router.patch("/:id/favorite", toggleFavorite);

export default router;
