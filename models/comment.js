var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = new Schema(
  {
    body: {
      type: String,
      required: true
    },
    articleId: {
      type: Schema.Types.ObjectId,
      ref: "Article"
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
