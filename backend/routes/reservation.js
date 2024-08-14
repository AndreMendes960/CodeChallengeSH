const express = require("express");
const jwt = require("jsonwebtoken");
const db = require('../database/models')
const router = express.Router();
const { body, validationResult } = require('express-validator');

const {authenticateToken, checkAdmin} = require('../middleware/permissions')

const CreateBookReservationValidationRules = () => {
    return [
      body('bookId').isInt().withMessage('Invalid Book')
    ];
};


router.post("/", authenticateToken, CreateBookReservationValidationRules(), async (req, res) => {
    try{

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { bookId } = req.body;

        const checkRes = await db.Reservation.findOne(
            {
                where:{
                    bookId: bookId
                }
            })
        
        if(checkRes)
            return res.status(400).send({ error: "Book already reserved" });

        const userId = req.user.userId

        const newRes = await db.Reservation.create({ bookId, userId });


        res.status(201).json({message : "Reservation made with success", res : newRes});

    } catch (error){
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/:id", authenticateToken,  async (req, res) => {
    try{

        const { id } = req.params;
        const checkRes = await db.Reservation.findOne({where:{id: id}})
        
        if(!checkRes)
            return res.status(400).send({ error: "Book reservation doesn't exist" });

        const userId = req.user.userId
        const isAdmin = db.Admin.findOne({where:{id : userId}})

        if(userId !== checkRes.userId && !isAdmin)
            return res.status(400).send({ error: "No permissions for deleting reservation" });

        await checkRes.destroy()

        res.status(200).json({message : "Reservation deleted with success"});

    } catch (error){
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/", authenticateToken, checkAdmin, async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {  page = 0, limit = 10 } = req.query;
        const offset = page * limit;

        const { rows, count } = await db.Reservation.findAndCountAll({
            limit: parseInt(limit),
            offset: offset,
            include: [
                {
                    model: db.Book,
                    as: 'book',
                },
                {
                    model: db.User,
                    as: 'user',
                }
            ],
        });


        res.status(200).json({
            total : count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit),
            rows
        });

    } catch (error){
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;