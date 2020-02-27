var express = require("express");
var router = express.Router();
var auth = require("../../modules/auth");
var userRouter = require("./user");
var usersRouter = require("./users");
var profilesRouter = require("./profiles");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.use("/users", usersRouter);
router.use("/user", userRouter);
router.use("/profiles", profilesRouter);
module.exports = router;
