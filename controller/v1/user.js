var User = require("../../models/users");

module.exports = {
  getUserInfo: async (req, res, next) => {
    try {
      // console.log(req.user);
      var userinfo = await User.findById(req.user.userId);
      res.status(200).json({ user: userinfo });
    } catch (error) {
      next(error);
    }
  },
  updateUserInfo: async (req, res, next) => {
    try {
      var updatedUser = await User.findByIdAndUpdate(
        req.user.userId,
        req.body.user
      );
      var userInfo = {
        email: updatedUser.email,
        token: req.user.token,
        username: updatedUser.username,
        bio: updatedUser.bio,
        image: updatedUser.image
      };
      res.status(201).json({ user: userInfo });
    } catch (error) {
      next(error);
    }
  }
};
