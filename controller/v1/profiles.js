var User = require("../../models/users");

module.exports = {
  // get user profile
  getUserProfile: async (req, res, next) => {
    // console.log("hello");
    // console.log(req.params.username);
    try {
      var userdDetails = await User.findOne({ username: req.params.username });
      if (userdDetails) {
        var userprofile = {
          username: userdDetails.username,
          bio: userdDetails.bio,
          image: userdDetails.image,
          following: false
        };
        res.status(200).json({ profile: userprofile });
      } else {
        res.status(404).json({ err: { body: ["invalid username"] } });
      }
    } catch (error) {
      next(error);
    }
  },
  // add followers
  addFollower: async (req, res, next) => {
    try {
      var otherUser = await User.findOne({ username: req.params.username });
      // console.log("hi");
      if (otherUser) {
        var loggedUser = await User.findByIdAndUpdate(req.user.userId, {
          $push: { following: otherUser.id }
        });
        var otherUser = await User.findByIdAndUpdate(otherUser.id, {
          $push: { follower: loggedUser.id }
        });

        var userprofile = {
          username: loggedUser.username,
          bio: loggedUser.bio,
          image: loggedUser.image,
          following: true
        };
        res.status(200).json({ profile: userprofile });
      } else {
        res.status(400).json({ err: " username doesnt exist" });
      }
    } catch (error) {
      next(error);
    }
  },
  // remove follower
  removeFollower: async (req, res, next) => {
    try {
      var otherUser = await User.findOne({ username: req.params.username });
      if (otherUser) {
        var loggedUser = await User.findByIdAndUpdate(req.user.userId, {
          $pull: { following: otherUser.id }
        });
        var otherUser = await User.findByIdAndUpdate(otherUser.id, {
          $pull: { follower: loggedUser.id }
        });

        var userprofile = {
          username: loggedUser.username,
          bio: loggedUser.bio,
          image: loggedUser.image,
          following: false
        };
        res.status(200).json({ profile: userprofile });
      } else {
        res.status(400).json({ err: " username doesnt exist" });
      }
    } catch (error) {
      next(error);
    }
  }
};
