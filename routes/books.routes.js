const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/Books.models");

const router = express.Router();


const sendError = (res, status, message) => {
  return res.status(status).json({ success: false, message });
};


router.post("/", async (req, res) => {
  try {
    const { title, author, category } = req.body;

    if (!title || !String(title).trim()) {
      return sendError(res, 400, "Please provide a title for the book");
    }

    const newBook = new Book({ title, author, category });
    const saved = await newBook.save();

    return res.status(201).json({
      success: true,
      message: "Book created",
      book: saved,
    });
  } catch (err) {
    return sendError(res, 500, `Could not add book: ${err.message}`);
  }
});


router.get("/", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skipCount = (page - 1) * limit;

    const totalRecords = await Book.countDocuments();
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skipCount)
      .limit(limit);

    return res.status(200).json({
      success: true,
      currentPage: page,
      perPage: limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      books,
    });
  } catch (err) {
    return sendError(res, 500, `Could not fetch books: ${err.message}`);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const { isAvailable } = req.body;

    if (!mongoose.isValidObjectId(bookId)) {
      return sendError(res, 400, "The book id format is not valid");
    }

    if (typeof isAvailable !== "boolean") {
      return sendError(res, 400, "not available");
    }

    const updated = await Book.findByIdAndUpdate(
      bookId,
      { isAvailable },
      { new: true }
    );

    if (!updated) {
      return sendError(res, 404, "Not found with this id");
    }

    return res.status(200).json({
      success: true,
      message: "Availability updated",
      book: updated,
    });
  } catch (err) {
    return sendError(res, 500, `Could not update book: ${err.message}`);
  }
});

module.exports = router;