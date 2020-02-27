var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 4,
      maxlength: 12
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /@/
    },
    password: {
      type: String,
      required: true
    },

    image: String,
    bio: String,
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    follower: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    articleId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Article"
      }
    ],
    favArticle: [
      {
        type: Schema.Types.ObjectId,
        ref: "Article"
      }
    ]
  },
  { timestamps: true }
);

userSchema.pre("save", async function(next) {
  try {
    if (this.password && this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
      next();
    }
  } catch (error) {
    next(error);
  }
});

userSchema.methods.verifyPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
