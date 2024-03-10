const express = require("express");
const { createTransaction, getTransactions, getSummary, deleteTrasaction } = require("../controller/transactionController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.post('/',authenticateToken,createTransaction);
router.get('/',authenticateToken,getTransactions);
router.get('/summary',authenticateToken,getSummary);
router.delete('/:id',authenticateToken,deleteTrasaction);

module.exports = router;