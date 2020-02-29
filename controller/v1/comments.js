var Article = require("../../models/article");
var User = require("../../models/users");
var Comment = require("../../models/comment");
var auth = require("../../modules/auth");

module.exports = {
  createComment: async (req, res, next) => {
    try {
      req.body.comment.author = req.user.userId;
      var article = await Article.findOne({ slug: req.params.slug });
      req.body.comment.articleId = article.id;
      // console.log(req.body.comment);
      const newComment = await (await Comment.create(req.body.comment))
        .populate("author")
        .execPopulate();
      await Article.findByIdAndUpdate(article.id, {
        $push: { commentId: newComment.id }
      });
      // var populatedComment = await Comment.findById(newComment.id);
      console.log(newComment);
      // res.status(200).json({ comment: populatedComment });
    } catch (error) {
      next(error);
    }
  },
  getAllComments: async (req, res, next) => {
    try {
      var allCommentId = await (
        await Article.findOne({ slug: req.params.slug })
      )
        .populate({
          path: "commentId",
          populate: {
            path: "author",
            model: "User"
          }
        })
        .execPopulate();

      // console.log(allCommentId);
      res.status(200).json({ comments: allCommentId.commentId });
    } catch (error) {
      next(error);
    }
  },
  // delete article
  deleteComment: async (req, res, next) => {
    try {
      var comment = await Comment.findById(req.params.id);
      var article = await Article.findOne({ slug: req.params.slug });
      console.log(comment.author, req.user.userId);
      if (comment.author == req.user.userId) {
        var updatedart = await Article.findByIdAndUpdate(
          article.id,
          { $pull: { commentId: comment.id } },
          { new: true }
        );
        console.log(updatedart);
        Comment.findByIdAndDelete(comment.id);
        res.status(200).json({ msg: "Comment deleted" });
      } else {
        res
          .status(400)
          .json({ err: " you are not authorised to delete the comment" });
      }
    } catch (error) {
      next(error);
    }
  }
};
