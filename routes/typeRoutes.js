const express = require("express");
const { createType, getTypes } = require("../controller/typeController");

const router = express.Router();

router.post('/',createType);
router.get('/',getTypes);

module.exports = router;