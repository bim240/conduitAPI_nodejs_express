var express = require("express");
var router = express.Router();
var auth = require("../../modules/auth");
var profileController = require("../../controller/v1/profiles");

router.get("/:username", profileController.getUserProfile);
router.post("/:username/follow", auth.userAuth, profileController.addFollower);
router.delete(
  "/:username/follow",
  auth.userAuth,
  profileController.removeFollower
);
// router.put("/", auth.userAuth, userController.updateUserInfo);

module.exports = router;
