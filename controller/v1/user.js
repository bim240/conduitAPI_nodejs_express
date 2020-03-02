var User = require("../../models/users");

module.exports = {
  getUserInfo: async (req, res, next) => {
    try {
      // console.log(req.user);
      var userInfo = await User.findById(req.user.userId);
      var userInfoFormat = {
        email: userInfo.email,
        token: req.user.token,
        username: userInfo.username,
        bio: userInfo.bio,
        image: userInfo.image
      };
      res.status(201).json({ user: userInfoFormat });
    } catch (error) {
      next(error);
    }
  },
  updateUserInfo: async (req, res, next) => {
    try {
      var updatedUser = await User.findByIdAndUpdate(
        req.user.userId,
        req.body.user,
        { new: true }
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
