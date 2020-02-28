var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var articleSchema = new Schema(
  {
    slug: {
      type: String
      // required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    tagList: [String],
    favorited: Boolean,
    favoritesCount: 0,
    author: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
