var User = require("../../models/users");
var auth = require("../../modules/auth");

module.exports = {
  // register user
  register: async (req, res, next) => {
    try {
      const user = await User.create(req.body.user);
      const token = await auth.generateJWT(user);
      var userInfo = {
        email: user.email,
        token,
        username: user.username,
        bio: user.bio,
        image: user.image
      };
      res.status(200).json({
        user: userInfo
      });
    } catch (error) {
      next(error);
    }
  },
  // user login
  login: async (req, res, next) => {
    try {
      var { email, password } = req.body.user;

      if (!email || !password) {
        res.status(400).json({ err: "email/password reuired" });
      }
      var user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "Invalid Email" });
      var result = await user.verifyPassword(password);
      if (!result) return res.status(400).json({ error: "Invalid Password" });
      var token = await auth.generateJWT(user);
      var userInfo = {
        email: user.email,
        token,
        username: user.username,
        bio: user.bio,
        image: user.image
      };
      res.json({ user: userInfo });
    } catch (error) {
      next(error);
    }
  }
};
