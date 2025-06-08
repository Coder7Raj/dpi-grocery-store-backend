const express = require("express");
const router = express.Router();
const { updateProfile } = require("../Config/userUpdate");
// const auth = require("../middleware/auth");
const upload = require("../Config/upload");

router.put("/update-profile",  upload.single("image"), updateProfile);

module.exports = router;
