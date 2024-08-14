const express = require("express");
const db = require('../database/models')
const router = express.Router();
const multer = require ("multer")
const csv = require('csv-parser');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const {sendEmail} = require('../lib/mailer')
const {authenticateToken, checkAdmin} = require('../middleware/permissions')


const bulkValidationRules = () => {
    return [
        body('file').custom((value, { req }) => 
            {
                if (!req.file) {
                    throw new Error('File is required');
                }
                return true;
            }),
    ];
};

const bookUpdateValidationRules = () =>{
    return[
        body('goodreads_book_id').isInt().withMessage('Goodreads Book ID must be an integer.'),
        body('best_book_id').isInt().withMessage('Best Book ID must be an integer.'),
        body('work_id').isInt().withMessage('Work ID must be an integer.'),
        body('isbn').notEmpty().withMessage('ISBN cannot be empty.'),
        body('isbn13').notEmpty().withMessage('ISBN13 cannot be empty.'),
        body('authors').notEmpty().withMessage('Authors cannot be empty.'),
        body('original_publication_year').isInt({ min: 0, max: 2024 }).withMessage('Original Publication Year must be an integer beween 0 and 2024.'),
        body('original_title').notEmpty().withMessage('Original Title cannot be empty.'),
        body('title').notEmpty().withMessage('Title cannot be empty.'),
        body('language_code').notEmpty().withMessage('Language Code cannot be empty.'),
        body('average_rating').isFloat({ min: 0, max: 5 }).withMessage('Average Rating must be a float between 0 and 5.'),
        body('image_url').notEmpty().withMessage('Image URL cannot be empty.'),
      ]
}

const upload = multer({ dest: 'uploads/' });

router.post("/create/bulk", authenticateToken, checkAdmin, upload.single('file'), bulkValidationRules(), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const filePath = req.file.path;
      
        const books = [];
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
                await sendEmail()
  
                res.status(201).send('Books successfully uploaded and saved.');
            } catch (err) {
                fs.unlinkSync(filePath);
                console.error('Error saving books: ', err);
                res.status(500).send('Error saving books.');
            }
        });
    } catch (err) {
        fs.unlinkSync(filePath);
        console.error('Error parsing CSV: ', err);
        res.status(500).send('Error processing the CSV file.');
    }
});

router.get("/", async(req, res) => {
    try {
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

router.get('/:id', async (req, res) => {
    try{
        const id = req.params.id;
        if (id === null) {
            return res.status(400).send("Invalid book.");
        }

        const book = await db.Book.findOne({
            where: {
                book_id: id,
            },
        });

        if (!book) 
            return res.status(400).send("Invalid book.");

        res.status(200).json(book);

    } catch (error){
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.put('/:id', authenticateToken, checkAdmin, bookUpdateValidationRules(), async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        if (id === null) {
            return res.status(400).send("Invalid book.");
        }

        const book = await db.Book.findOne({
            where: {
                book_id: id,
            },
        });

        if(!book){
            return res.status(400).send("Invalid book.");
        }

        const { goodreads_book_id, best_book_id, work_id, isbn, isbn13, authors, original_publication_year, original_title, title,
            language_code, average_rating, image_url, } = req.body;
    
        await book.update({ goodreads_book_id, best_book_id, work_id, isbn, isbn13, authors, original_publication_year,
            original_title, title, language_code, average_rating, image_url });
    
        res.status(200).json({ message: 'Book updated successfully', book });

    } catch (error){
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})

module.exports = router;