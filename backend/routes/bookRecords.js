const express = require("express");
const jwt = require("jsonwebtoken");
const db = require('../database/models')
const router = express.Router();
const multer = require ("multer")
const csv = require('csv-parser');
const fs = require('fs');
const { body, validationResult } = require('express-validator');


const bulkValidationRules = () => {
    return [
        body('file')
            .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('File is required');
            }
            return true;
      }),
    ];
};

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({ error: 'No token provided.' });

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token.' });
        req.user = user;
        next();
    });
};

const upload = multer({ dest: 'uploads/' }); // Directory to store uploaded files

router.post("/create/bulk", bulkValidationRules(), upload.single('file'), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const filePath = req.file.path;
  
    const books = [];
  
    try {
      // Parse the CSV file and store the data in the books array
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          books.push({
            book_id: row.book_id,
            goodreads_book_id: row.goodreads_book_id,
            best_book_id: row.best_book_id,
            work_id: row.work_id,
            isbn: row.isbn,
            isbn13: row.isbn13,
            authors: row.authors,
            original_publication_year: parseFloat(row.original_publication_year),
            original_title: row.original_title,
            title: row.title,
            language_code: row.language_code,
            average_rating: parseFloat(row.average_rating),
            ratings_count: parseInt(row.ratings_count, 10),
            work_ratings_count: parseInt(row.work_ratings_count, 10),
            work_text_reviews_count: parseInt(row.work_text_reviews_count, 10),
            ratings_1: parseInt(row.ratings_1, 10),
            ratings_2: parseInt(row.ratings_2, 10),
            ratings_3: parseInt(row.ratings_3, 10),
            ratings_4: parseInt(row.ratings_4, 10),
            ratings_5: parseInt(row.ratings_5, 10),
            small_image_url: row.small_image_url,
            image_url: row.image_url,
          });
        })
        .on('end', async () => {
          try {
            await db.Book.bulkCreate(books);
  
            fs.unlinkSync(filePath);
  
            res.status(201).send('Books successfully uploaded and saved.');
          } catch (err) {
            console.error('Error saving books: ', err);
            res.status(500).send('Error saving books.');
          }
        });
    } catch (err) {
      console.error('Error parsing CSV: ', err);
      res.status(500).send('Error processing the CSV file.');
    }
});


router.get("/", authenticateToken, async(req, res) => {
    try {
        console.log(req.query)
        const { title, authors, year, rating, page = 0, limit = 10 } = req.query;

        // Building the search query
        const whereClause = {};
        
        if (title) {
            whereClause.original_title = { [Op.iLike]: `%${title}%` }; // Case-insensitive search
        }
        if (authors) {
            whereClause.authors = { [Op.iLike]: `%${authors}%` }; // Case-insensitive search
        }
        if (year) {
            whereClause.original_publication_year = year;
        }
        if (rating) {
            whereClause.average_rating = { [Op.gte]: rating }; // Books with a rating greater than or equal to the given rating
        }

        // Pagination logic
        const offset = page * limit;

        // Fetching the books with the applied filters and pagination
        const { rows, count } = await db.Book.findAndCountAll({
            where: whereClause,
            attributes: ['book_id', 'image_url', 'authors', 'original_publication_year', 'original_title'],
            limit: parseInt(limit),
            offset: offset,
        });

        // Returning the response with pagination details
        res.status(200).json({
            total : count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit),
            rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;