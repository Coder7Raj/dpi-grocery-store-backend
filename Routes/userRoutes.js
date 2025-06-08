const express = require('express');
const router = express.Router();
const {getAllUsers} = require("../Config/user");

// GET /api/admin/users
router.get("/alluser", getAllUsers);


module.exports = router;