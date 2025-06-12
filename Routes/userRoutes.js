const express = require('express');
const router = express.Router();
const {getAllUsers, deleteUser, searchUsersByName, getuser} = require("../Config/user");

// GET /api/admin/users
router.get("/alluser", getAllUsers);

// DELETE /api/admin/users/:id
router.delete("/:id",  deleteUser);

router.get('/search', searchUsersByName); 

router.get('/getuser/:id', getuser); 





module.exports = router;