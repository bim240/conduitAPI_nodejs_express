var User = require("../../models/users");

module.exports = {
  getUserProfile: async (req, res, next) => {
    // console.log("hello");
    // console.log(req.params.username);
    try {
      var userdDetails = await User.findOne({ username: req.params.username });
      var userprofile = {
        username: userdDetails.username,
        bio: userdDetails.bio,
        image: userdDetails.image,
        following: false
      };
      res.status(200).json({ profile: userprofile });
    } catch (error) {
      next(error);
    }
  },
  addFollower: async (req, res, next) => {
    try {
      var userdDetails = await User.findOne({ username: req.params.username });
      var userprofile = {
        username: userdDetails.username,
        bio: userdDetails.bio,
        image: userdDetails.image,
        following: false
      };
      res.status(200).json({ profile: userprofile });
    } catch (error) {
      next(error);
    }
  },
  removeFollower: async (req, res, next) => {
    try {
      var userdDetails = await User.findOne({ username: req.params.username });
      var userprofile = {
        username: userdDetails.username,
        bio: userdDetails.bio,
        image: userdDetails.image,
        following: false
      };
      res.status(200).json({ profile: userprofile });
    } catch (error) {
      next(error);
    }
  }
};
