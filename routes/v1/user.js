var express = require("express");
var router = express.Router();
var auth = require("../../modules/auth");
var userController = require("../../controller/v1/user");

router.get("/", auth.userAuth, userController.getUserInfo);
router.put("/", auth.userAuth, userController.updateUserInfo);

module.exports = router;
